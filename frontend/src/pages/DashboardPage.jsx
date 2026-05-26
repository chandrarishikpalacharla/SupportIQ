import { useSelector } from "react-redux"
import { useAuth } from "../context/AuthContext"
import MainLayout from "../layouts/MainLayout"
import "../styles/DashboardPage.css"

const StatCard = ({ label, value, color }) => (
  <div className="stat-card">
    <p className="stat-card-label">{label}</p>
    <p className={`stat-card-value stat-card-value-${color}`}>{value}</p>
  </div>
)

const DashboardPage = () => {
  const { user } = useAuth()
  const messages = useSelector(state => state.chat.messages)
  const docs = useSelector(state => state.upload.docs)
  const readyDocs = docs.filter(d => d.status === "READY")
  const processingDocs = docs.filter(d => d.status === "PROCESSING")

  return (
    <MainLayout>
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-subtitle">Welcome back, {user?.email}</p>
      <div className="dashboard-grid">
        <StatCard label="Total Documents" value={docs.length} color="blue" />
        <StatCard label="Ready" value={readyDocs.length} color="green" />
        <StatCard label="Processing" value={processingDocs.length} color="yellow" />
        <StatCard label="Questions Asked" value={messages.length} color="purple" />
      </div>
      {messages.length > 0 && (
        <div className="dashboard-recent">
          <h3 className="dashboard-recent-title">Recent Questions</h3>
          {messages.filter(m => m.role === "user").slice(-3).map((msg, i) => (
            <div key={i} className="dashboard-recent-item">
              {msg.content}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}

export default DashboardPage