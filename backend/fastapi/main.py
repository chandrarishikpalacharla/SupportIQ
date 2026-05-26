from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat_router import router as chat_router
from services.kafka_service import start_kafka_consumer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SupportIQ AI Service", version="1.0.0")

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(chat_router, prefix="/chat", tags=["Chat"])


@app.on_event("startup")
async def startup_event():
    logger.info("SupportIQ FastAPI service starting...")
    # Start Kafka consumer in background thread
    start_kafka_consumer()
    logger.info("All services started successfully")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "SupportIQ FastAPI"}
