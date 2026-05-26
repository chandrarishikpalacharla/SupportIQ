import { useEffect } from "react"
import { useSelector } from "react-redux"
import MainLayout from "../layouts/MainLayout"
import AlertBanner from "../components/AlertBanner"
import useUpload from "../hooks/useUpload"
import "../styles/UploadPage.css"
import FileUploadCard from "../components/FileUploadCard"
import StatusBadge from "../components/StatusBadge"
import LoadingSpinner from "../components/LoadingSpinner"

const UploadPage = () => {
  const { docs, uploading, uploadFile, fetchDocs, deleteFile } = useUpload()
  const error = useSelector(state => state.upload.error)

  useEffect(() => {
    fetchDocs()
  }, [])

  return (
    <MainLayout>
      <h2 className="upload-page-title">Upload Documents</h2>
      <AlertBanner message={error} type="error" />
      <FileUploadCard onFileSelect={uploadFile} />
      {uploading && (
        <div className="upload-progress">
          <LoadingSpinner />
          <p className="upload-progress-text">Uploading and indexing document...</p>
        </div>
      )}
      <div className="upload-docs-section">
        <h3 className="upload-docs-title">
          Uploaded Documents ({docs.length})
        </h3>
        {docs.length === 0 && (
          <p className="upload-docs-empty">No documents uploaded yet</p>
        )}
        <div className="upload-docs-list">
          {docs.map(doc => (
            <div key={doc.id} className="upload-doc-item">
              <div>
                <p className="upload-doc-name">{doc.filename}</p>
                <p className="upload-doc-date">{doc.uploadedAt}</p>
              </div>
              <div className="upload-doc-actions">
                <StatusBadge status={doc.status} />
                <button
                  onClick={() => deleteFile(doc.id)}
                  className="upload-doc-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default UploadPage