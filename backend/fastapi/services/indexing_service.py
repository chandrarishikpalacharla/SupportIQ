from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, Settings
from llama_index.core import PromptTemplate
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from services.qdrant_service import get_qdrant_client, ensure_collection, get_collection_name
from config import GROQ_API_KEY
import logging
import asyncio

logger = logging.getLogger(__name__)

# Setup embedding model
embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Setup Groq LLM — updated model
llm = Groq(model="llama-3.1-8b-instant", api_key=GROQ_API_KEY)

# Global settings
Settings.embed_model = embed_model
Settings.llm = llm
Settings.chunk_size = 512
Settings.chunk_overlap = 50

# System prompt — restricts to document context only
QA_PROMPT = PromptTemplate(
    "You are a helpful support assistant for a company. "
    "Answer questions ONLY based on the context provided below from company documents. "
    "If the answer is not in the context, respond with: "
    "'I could not find relevant information in the uploaded documents. "
    "Please upload relevant documents or rephrase your question.'\n\n"
    "Do not use any outside knowledge. Be concise and accurate.\n\n"
    "Context:\n{context_str}\n\n"
    "Question: {query_str}\n\n"
    "Answer: "
)


def index_document(document_id: str, tenant_id: str, file_path: str):
    try:
        logger.info(f"Starting indexing for doc: {document_id}, tenant: {tenant_id}")
        ensure_collection(tenant_id)

        documents = SimpleDirectoryReader(input_files=[file_path]).load_data()

        for doc in documents:
            doc.metadata["document_id"] = document_id
            doc.metadata["tenant_id"] = tenant_id

        client = get_qdrant_client()
        collection_name = get_collection_name(tenant_id)
        vector_store = QdrantVectorStore(client=client, collection_name=collection_name)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        VectorStoreIndex.from_documents(
            documents,
            storage_context=storage_context,
            show_progress=True
        )

        logger.info(f"Successfully indexed doc: {document_id}")
        return True

    except Exception as e:
        logger.error(f"Failed to index document {document_id}: {e}")
        raise e


def query_documents(question: str, tenant_id: str) -> str:
    try:
        ensure_collection(tenant_id)
        client = get_qdrant_client()
        collection_name = get_collection_name(tenant_id)

        vector_store = QdrantVectorStore(client=client, collection_name=collection_name)
        index = VectorStoreIndex.from_vector_store(vector_store)

        query_engine = index.as_query_engine(
            similarity_top_k=3,
            text_qa_template=QA_PROMPT
        )
        response = query_engine.query(question)
        answer = str(response).strip()

        # Handle empty response
        if not answer or answer.lower() == "empty response" or len(answer) < 5:
            return "I could not find relevant information in the uploaded documents. Please upload relevant documents first."

        return answer

    except Exception as e:
        logger.error(f"Query failed for tenant {tenant_id}: {e}")
        raise e


async def query_documents_stream(question: str, tenant_id: str):
    """
    Async generator — yields tokens one by one for WebSocket streaming
    """
    try:
        ensure_collection(tenant_id)
        client = get_qdrant_client()
        collection_name = get_collection_name(tenant_id)

        vector_store = QdrantVectorStore(client=client, collection_name=collection_name)
        index = VectorStoreIndex.from_vector_store(vector_store)

        # Use streaming query engine
        query_engine = index.as_query_engine(
            similarity_top_k=3,
            text_qa_template=QA_PROMPT,
            streaming=True
        )

        response = query_engine.query(question)

        # Stream tokens
        for token in response.response_gen:
            yield token
            await asyncio.sleep(0)  # allow other tasks to run

    except Exception as e:
        logger.error(f"Stream query failed for tenant {tenant_id}: {e}")
        yield "Sorry, I could not find an answer. Please try again."
