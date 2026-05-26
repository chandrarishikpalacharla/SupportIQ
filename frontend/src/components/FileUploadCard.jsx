import { useRef } from "react"
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../utils/constants"
import "../styles/FileUploadCard.css"

const FileUploadCard = ({ onFileSelect }) => {
  const inputRef = useRef(null)

  const validateAndSelect = (file) => {
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only PDF, TXT and DOCX files allowed")
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be under 10MB")
      return
    }
    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    validateAndSelect(e.dataTransfer.files[0])
  }

  const handleChange = (e) => {
    validateAndSelect(e.target.files[0])
  }

  return (
    <div
      className="upload-card"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
    >
      <div className="upload-icon">📄</div>
      <p className="upload-title">Drag and drop file here</p>
      <p className="upload-subtitle">PDF, TXT, DOCX up to 10MB</p>
      <input
        ref={inputRef}
        type="file"
        className="upload-input"
        accept=".pdf,.txt,.docx"
        onChange={handleChange}
      />
    </div>
  )
}

export default FileUploadCard