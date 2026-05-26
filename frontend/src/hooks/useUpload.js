import { useDispatch, useSelector } from "react-redux"
import { addDoc, removeDoc, setUploading, setError,setDocs } from "../store/uploadSlice"
import { uploadDoc, getDocsList, deleteDoc } from "../api/uploadApi"
import { useAuth } from "../context/AuthContext"

const useUpload = () => {
  const dispatch = useDispatch()
  const docs = useSelector(state => state.upload.docs)
  const uploading = useSelector(state => state.upload.uploading)
  const { tenantId } = useAuth()

  const uploadFile = async (file) => {
    try {
      dispatch(setUploading(true))
      const res = await uploadDoc(file, tenantId)
      dispatch(addDoc(res.data))
    } catch {
      dispatch(setError("Upload failed. Please try again."))
    } finally {
      dispatch(setUploading(false))
    }
  }

  const fetchDocs = async () => {
    try {
        const res = await getDocsList()
        dispatch(setDocs(res.data))
    } catch {
        dispatch(setError("Failed to fetch documents."))
    }
}
  const deleteFile = async (docId) => {
    try {
      await deleteDoc(docId)
      dispatch(removeDoc(docId))
    } catch {
      dispatch(setError("Delete failed. Please try again."))
    }
  }

  return { docs, uploading, uploadFile, fetchDocs, deleteFile }
}

export default useUpload
