from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import JSONResponse
from models.schemas import ChatRequest, ChatResponse
from services.indexing_service import query_documents_stream, query_documents
import logging
import json
import time
from collections import defaultdict
import redis
import hashlib

# Redis connection
try:
    redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)
    redis_client.ping()
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False

CACHE_TTL = 3600  # cache for 1 hour

def get_cache_key(question: str, tenant_id: str) -> str:
    # normalize question — lowercase, strip spaces
    normalized = question.lower().strip()
    return f"cache:{tenant_id}:{hashlib.md5(normalized.encode()).hexdigest()}"

router = APIRouter()
logger = logging.getLogger(__name__)

chat_history: dict = {}

# Simple in-memory rate limiter
request_counts: dict = defaultdict(list)
RATE_LIMIT = 10  # max requests
RATE_WINDOW = 60  # per 60 seconds

def is_rate_limited(tenant_id: str) -> bool:
    now = time.time()
    # Remove requests older than window
    request_counts[tenant_id] = [
        t for t in request_counts[tenant_id]
        if now - t < RATE_WINDOW
    ]
    # Check limit
    if len(request_counts[tenant_id]) >= RATE_LIMIT:
        return True
    # Add current request
    request_counts[tenant_id].append(now)
    return False


@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):
    if is_rate_limited(request.tenantId):
        return ChatResponse(
            answer=f"Rate limit exceeded. Maximum {RATE_LIMIT} questions per minute.",
            tenantId=request.tenantId
        )

    try:
        # Check Redis cache first
        if REDIS_AVAILABLE:
            cache_key = get_cache_key(request.question, request.tenantId)
            cached = redis_client.get(cache_key)
            if cached:
                logger.info(f"Cache hit for tenant {request.tenantId}")
                return ChatResponse(answer=cached, tenantId=request.tenantId)

        answer = query_documents(request.question, request.tenantId)

        # Store in Redis cache
        if REDIS_AVAILABLE:
            redis_client.setex(cache_key, CACHE_TTL, answer)

        # Store in history
        if request.tenantId not in chat_history:
            chat_history[request.tenantId] = []
        chat_history[request.tenantId].append({"role": "user", "content": request.question})
        chat_history[request.tenantId].append({"role": "assistant", "content": answer})

        return ChatResponse(answer=answer, tenantId=request.tenantId)

    except Exception as e:
        logger.error(f"Chat error: {e}")
        return ChatResponse(
            answer="Sorry, I could not find an answer. Please try again.",
            tenantId=request.tenantId
        )


@router.get("/history/{tenant_id}")
async def get_chat_history(tenant_id: str):
    return chat_history.get(tenant_id, [])


@router.delete("/history/{tenant_id}")
async def clear_chat_history(tenant_id: str):
    chat_history.pop(tenant_id, None)
    return {"message": "History cleared"}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection established")

    try:
        while True:
            data = await websocket.receive_json()
            question = data.get("question", "")
            tenant_id = data.get("tenantId", "")

            if not question or not tenant_id:
                await websocket.send_json({"error": "Missing question or tenantId"})
                continue

            # Rate limit check for WebSocket too
            if is_rate_limited(tenant_id):
                await websocket.send_json({
                    "type": "done",
                    "content": f"Rate limit exceeded. Maximum {RATE_LIMIT} questions per minute.",
                    "role": "assistant"
                })
                continue

            try:
                await websocket.send_json({"type": "typing", "content": ""})

                full_answer = ""
                async for token in query_documents_stream(question, tenant_id):
                    full_answer += token
                    await websocket.send_json({"type": "token", "content": token})

                await websocket.send_json({
                    "type": "done",
                    "content": full_answer,
                    "role": "assistant"
                })

                if tenant_id not in chat_history:
                    chat_history[tenant_id] = []
                chat_history[tenant_id].append({"role": "user", "content": question})
                chat_history[tenant_id].append({"role": "assistant", "content": full_answer})

            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "content": "Failed to get answer. Please try again."
                })

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")