import { useAuth } from "../context/AuthContext"
import MainLayout from "../layouts/MainLayout"

const SettingsPage = () => {
  const { user, tenantId, logout } = useAuth()

  return (
    <MainLayout>
      <h2 className="page-title">Settings</h2>
      <p className="page-subtitle">Manage your account</p>

      <div style={{ maxWidth: "500px" }}>

        {/* Account Info */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
            Account Information
          </h3>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div style={{ fontSize: "14px", color: "#1e293b", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              {user?.email}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Role</label>
            <div style={{ fontSize: "14px", color: "#1e293b", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              {user?.role}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Tenant ID</label>
            <div style={{ fontSize: "14px", color: "#1e293b", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
              {tenantId}
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="card" style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>
            Usage Limits
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Questions per minute</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>10</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Uploads per hour</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>20</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Max file size</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#2563eb" }}>10 MB</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ border: "1px solid #fecaca" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#b91c1c", marginBottom: "8px" }}>
            Danger Zone
          </h3>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            Logging out will end your current session.
          </p>
          <button
            className="btn"
            onClick={logout}
            style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" }}
          >
            Logout
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default SettingsPage
