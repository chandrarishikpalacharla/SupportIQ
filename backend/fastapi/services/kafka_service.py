from kafka import KafkaConsumer, KafkaProducer
from config import KAFKA_BOOTSTRAP_SERVERS
from models.schemas import KafkaUploadEvent, DocumentStatusUpdate
from services.indexing_service import index_document
import json
import logging
import threading

logger = logging.getLogger(__name__)

# Producer to send status updates back to Spring Boot
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    key_serializer=lambda k: k.encode("utf-8") if k else None
)

def publish_status_update(document_id: str, tenant_id: str, status: str):
    update = {
        "documentId": document_id,
        "tenantId": tenant_id,
        "status": status
    }
    producer.send("doc-status", key=tenant_id, value=update)
    producer.flush()
    logger.info(f"Published status update: {document_id} -> {status}")


def consume_upload_events():
    """
    Runs in background thread
    Listens to doc-upload topic
    When event arrives — indexes document — publishes status update
    """
    consumer = KafkaConsumer(
        "doc-upload",
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="fastapi-worker-group",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="earliest",
        enable_auto_commit=True
    )

    logger.info("Kafka consumer started — listening to doc-upload topic")

    for message in consumer:
        try:
            event = message.value
            document_id = event["documentId"]
            tenant_id = event["tenantId"]
            file_path = event["filePath"]

            logger.info(f"Received upload event for doc: {document_id}")

            # Publish PROCESSING status
            publish_status_update(document_id, tenant_id, "PROCESSING")

            # Index the document
            index_document(document_id, tenant_id, file_path)

            # Publish READY status
            publish_status_update(document_id, tenant_id, "READY")

        except Exception as e:
            logger.error(f"Failed to process upload event: {e}")
            try:
                publish_status_update(event.get("documentId", ""), 
                                       event.get("tenantId", ""), 
                                       "FAILED")
            except:
                pass


def start_kafka_consumer():
    # Run in background thread so it doesn't block FastAPI
    thread = threading.Thread(target=consume_upload_events, daemon=True)
    thread.start()
    logger.info("Kafka consumer thread started")
