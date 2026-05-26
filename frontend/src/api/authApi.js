import { springbootApi } from "./axiosConfig"

export const login = (email, password) => {
  return springbootApi.post("/auth/login", { email, password })
}

export const logout = () => {
  return springbootApi.post("/auth/logout")
}

export const getMe = () => {
  return springbootApi.get("/auth/me")
}
