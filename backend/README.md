# SupportIQ Backend

## Architecture

```
React (3000)
    ↓
Spring Boot (8080) — Auth, Upload, Kafka Producer
    ↓
Kafka (9092)
    ↓
FastAPI (8000) — LlamaIndex, Qdrant, Groq, Kafka Consumer
    ↓
Qdrant (6333) — Vector Store
```

## Quick Start

### Step 1 — Add Groq API key
Get free API key from https://console.groq.com
Edit fastapi/.env:
```
GROQ_API_KEY=your-actual-key-here
```

### Step 2 — Start all services with Docker
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on 5432
- Redis on 6379
- Zookeeper on 2181
- Kafka on 9092
- Qdrant on 6333
- Spring Boot on 8080
- FastAPI on 8000

### Step 3 — Register a user (one time)
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@company.com","password":"password123","tenantId":"tenant-001"}'
```

### Step 4 — Start React frontend
```bash
cd ui
npm start
```

### Step 5 — Open browser
http://localhost:3000
Login with test@company.com / password123

## Without Docker (local development)

### Start infrastructure only
```bash
docker-compose up postgres redis kafka zookeeper qdrant -d
```

### Start Spring Boot
```bash
cd springboot
mvn spring-boot:run
```

### Start FastAPI
```bash
cd fastapi
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Spring Boot (8080)
- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /auth/me
- POST /docs/upload
- GET /docs/list
- GET /docs/status/{docId}
- DELETE /docs/{docId}

### FastAPI (8000)
- POST /chat/ask
- GET /chat/history/{tenantId}
- DELETE /chat/history/{tenantId}
- WS /chat/ws

## Flow
1. User uploads doc → Spring Boot saves file → publishes to Kafka doc-upload topic
2. FastAPI Kafka consumer picks up event → LlamaIndex chunks + embeds → stores in Qdrant
3. FastAPI publishes READY status to doc-status topic
4. Spring Boot Kafka consumer picks up status → updates DB
5. User asks question → FastAPI searches Qdrant → calls Groq → returns answer
