import { useNavigate, useLocation } from "react-router-dom"
import { ROUTES } from "../utils/constants"
import "../styles/Sidebar.css"

const links = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "📊" },
  { label: "Upload Docs", path: ROUTES.UPLOAD, icon: "📁" },
  { label: "Chat", path: ROUTES.CHAT, icon: "💬" },
  { label: "Settings", path: ROUTES.SETTINGS, icon: "⚙️" }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">SupportIQ</h2>
      {links.map(link => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className={`sidebar-link ${location.pathname === link.path ? "sidebar-link-active" : ""}`}
        >
          <span>{link.icon}</span>
          {link.label}
        </button>
      ))}
    </div>
  )
}

export default Sidebar