from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str
    tenantId: str

class ChatResponse(BaseModel):
    answer: str
    tenantId: str

class KafkaUploadEvent(BaseModel):
    documentId: str
    tenantId: str
    filePath: str
    filename: str

class DocumentStatusUpdate(BaseModel):
    documentId: str
    tenantId: str
    status: str
