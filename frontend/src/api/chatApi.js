import { fastapiApi } from "./axiosConfig"

export const askQuestion = (question, tenantId) => {
  return fastapiApi.post("/chat/ask", { question, tenantId })
}

export const getChatHistory = (tenantId) => {
  return fastapiApi.get(`/chat/history/${tenantId}`)
}

export const clearHistory = (tenantId) => {
  return fastapiApi.delete(`/chat/history/${tenantId}`)
}
