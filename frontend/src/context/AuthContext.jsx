import { createContext, useContext, useState, useEffect } from "react"
import { login as loginApi, logout as logoutApi, getMe } from "../api/authApi"
import { ROUTES } from "../utils/constants"
import "../styles/AuthContext.css"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [tenantId, setTenantId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(res => {
        setUser(res.data.user)
        setTenantId(res.data.tenantId)
        sessionStorage.setItem("tenantId", res.data.tenantId)
      })
      .catch(() => {
        setUser(null)
        setTenantId(null)
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, tid) => {
    setUser(userData)
    setTenantId(tid)
    sessionStorage.setItem("tenantId", tid)
  }

  const logout = async () => {
    try { await logoutApi() } catch {}
    setUser(null)
    setTenantId(null)
    sessionStorage.removeItem("tenantId")
    window.location.href = ROUTES.LOGIN
  }

  if (loading) return (
    <div className="auth-loading">
      <div className="auth-spinner" />
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, tenantId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)