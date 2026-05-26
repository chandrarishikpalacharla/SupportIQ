import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addMessage, setLoading, setError } from "../store/chatSlice"
import { useAuth } from "../context/AuthContext"
import { WEBSOCKET_URL } from "../utils/constants"

const useChat = () => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.chat.messages)
  const loading = useSelector(state => state.chat.loading)
  const { tenantId } = useAuth()
  const [streamingContent, setStreamingContent] = useState("")
  const wsRef = useRef(null)

  const getWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current
    }
    const ws = new WebSocket(`${WEBSOCKET_URL}/chat/ws`)
    wsRef.current = ws
    return ws
  }

  const sendMessage = (question) => {
    if (!question.trim() || loading) return

    dispatch(addMessage({ role: "user", content: question }))
    dispatch(setLoading(true))
    setStreamingContent("")

    const ws = getWebSocket()

    ws.onopen = () => {
      ws.send(JSON.stringify({ question, tenantId }))
    }

    // if already open send immediately
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ question, tenantId }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "token") {
        setStreamingContent(prev => prev + data.content)
      } else if (data.type === "done") {
        dispatch(addMessage({ role: "assistant", content: data.content }))
        dispatch(setLoading(false))
        setStreamingContent("")
        ws.close()
        wsRef.current = null
      } else if (data.type === "error") {
        dispatch(setError(data.content))
        dispatch(setLoading(false))
        setStreamingContent("")
        ws.close()
        wsRef.current = null
      }
    }

    ws.onerror = () => {
      dispatch(setError("Connection error. Please try again."))
      dispatch(setLoading(false))
      setStreamingContent("")
    }

    ws.onclose = () => {
      if (loading) {
        dispatch(setLoading(false))
      }
    }
  }

  return { messages, loading, sendMessage, streamingContent }
}

export default useChat