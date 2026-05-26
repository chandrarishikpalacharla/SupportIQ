import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ROUTES } from "../utils/constants"

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to={ROUTES.LOGIN}/>
}

export default ProtectedRoute
