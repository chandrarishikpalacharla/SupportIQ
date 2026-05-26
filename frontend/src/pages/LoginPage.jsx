import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { login } from "../api/authApi"
import AuthLayout from "../layouts/AuthLayout"
import AlertBanner from "../components/AlertBanner"
import { ROUTES } from "../utils/constants"
import "../styles/LoginPage.css"
import LoadingSpinner from "../components/LoadingSpinner"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login: loginContext } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await login(email, password)
      loginContext(res.data.user, res.data.tenantId)
      navigate(ROUTES.DASHBOARD)
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

   /** testing  */
    // const handleLogin = async () => {
    // if (!email || !password) {
    //     setError("Please enter email and password")
    //     return
    // }
    // // Mock login - skip API, use fake user
    // loginContext(
    //     { id: "mock-123", email, name: "Test User", role: "admin" },
    //     "mock-tenant"
    // )
    // navigate(ROUTES.DASHBOARD)
    // }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <AuthLayout>
      <h2 className="login-title">Welcome back</h2>
      <p className="login-subtitle">Sign in to SupportIQ</p>
      <AlertBanner message={error} type="error" />
      <div className="login-field">
        <label className="login-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="login-input"
          placeholder="you@company.com"
        />
      </div>
      <div className="login-field-last">
        <label className="login-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="login-input"
          placeholder="Enter password"
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="login-btn"
      >
        {loading ? <LoadingSpinner /> : "Sign In"}
      </button>
    </AuthLayout>
  )
}

export default LoginPage