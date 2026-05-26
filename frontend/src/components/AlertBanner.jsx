import "../styles/AlertBanner.css"

const AlertBanner = ({ message, type = "info" }) => {
  if (!message) return null
  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  )
}

export default AlertBanner