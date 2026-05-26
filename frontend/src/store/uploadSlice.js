import { createSlice } from "@reduxjs/toolkit"

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    docs: [],
    uploading: false,
    error: null,
    selectedDoc: null
  },
  reducers: {
    addDoc: (state, action) => { state.docs.push(action.payload) },
    updateDocStatus: (state, action) => {
        const doc = state.docs.find(d => d.id === action.payload.id)
        if (doc) doc.status = action.payload.status
    },
    removeDoc: (state, action) => {
        state.docs = state.docs.filter(d => d.id !== action.payload)
    },
    setUploading: (state, action) => { state.uploading = action.payload },
    setSelectedDoc: (state, action) => { state.selectedDoc = action.payload },
    setError: (state, action) => { state.error = action.payload },
    setDocs: (state, action) => { state.docs = action.payload }  // ← add this
    }
})

export const { addDoc, updateDocStatus, removeDoc, setUploading, setSelectedDoc, setError, setDocs } = uploadSlice.actions
export default uploadSlice.reducer
