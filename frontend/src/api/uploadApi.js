import { springbootApi } from "./axiosConfig"

export const uploadDoc = (file, tenantId) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("tenantId", tenantId)
  return springbootApi.post("/docs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}

export const getDocStatus = (docId) => {
  return springbootApi.get(`/docs/status/${docId}`)
}

export const getDocsList = () => {
  return springbootApi.get("/docs/list")
}

export const deleteDoc = (docId) => {
  return springbootApi.delete(`/docs/${docId}`)
}
