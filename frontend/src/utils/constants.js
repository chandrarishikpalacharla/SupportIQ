const SPRINGBOOT_URL = "http://localhost:8080"
const FASTAPI_URL = "http://localhost:8000"
const WEBSOCKET_URL = "ws://localhost:8000"

const MAX_FILE_SIZE = 1024 * 1024 * 10

const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

const DOC_STATUS = {
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED"
}

const CHAT_ROLE = {
  USER: "user",
  ASSISTANT: "assistant"
}

const QUESTION_RATE_LIMIT = 10

const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  CHAT: "/chat",
  SETTINGS: "/settings"
}

export {
  SPRINGBOOT_URL,
  FASTAPI_URL,
  WEBSOCKET_URL,
  MAX_FILE_SIZE,
  ALLOWED_TYPES,
  DOC_STATUS,
  CHAT_ROLE,
  QUESTION_RATE_LIMIT,
  ROUTES
}