import "../styles/StatusBadge.css"

const STATUS_CLASSES = ["PROCESSING", "READY", "FAILED"]

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_CLASSES.includes(status) ? `badge-${status}` : "badge-default"}`}>
    {status}
  </span>
)

export default StatusBadge