import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "./chatSlice"
import uploadReducer from "./uploadSlice"

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    upload: uploadReducer
  }
})
