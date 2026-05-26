import axios from "axios"
import { SPRINGBOOT_URL, FASTAPI_URL } from "../utils/constants"

export const springbootApi = axios.create({
  baseURL: SPRINGBOOT_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
})

export const fastapiApi = axios.create({
  baseURL: FASTAPI_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
})

springbootApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

fastapiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
