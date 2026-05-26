import { useAuth } from "../context/AuthContext"
import { useSelector } from "react-redux"
import "../styles/Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const messages = useSelector(state => state.chat.messages)

  return (
    <div className="navbar">
      <h1 className="navbar-logo">SupportIQ</h1>
      <div className="navbar-right">
        <span className="navbar-message-count">{messages.length} questions asked</span>
        <span className="navbar-email">{user?.email}</span>
        <button onClick={logout} className="navbar-logout">
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar