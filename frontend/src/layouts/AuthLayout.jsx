import "../styles/AuthLayout.css"

const AuthLayout = ({ children }) => (
  <div className="auth-layout">
    <div className="auth-card">
      {children}
    </div>
  </div>
)

export default AuthLayout