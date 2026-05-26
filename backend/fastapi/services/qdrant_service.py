from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from config import QDRANT_HOST, QDRANT_PORT
import logging

logger = logging.getLogger(__name__)

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

VECTOR_SIZE = 384

def get_collection_name(tenant_id: str) -> str:
    return f"tenant_{tenant_id}"

def ensure_collection(tenant_id: str):
    collection_name = get_collection_name(tenant_id)
    # Fix — use get_collections() instead of collection_exists()
    existing = [c.name for c in client.get_collections().collections]
    if collection_name not in existing:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
        )
        logger.info(f"Created Qdrant collection: {collection_name}")

def get_qdrant_client():
    return client