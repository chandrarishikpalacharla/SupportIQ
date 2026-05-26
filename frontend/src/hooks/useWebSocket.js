import { useEffect, useRef, useCallback } from "react"
import { WEBSOCKET_URL } from "../utils/constants"

const useWebSocket = (onMessage, onToken, onDone) => {
  const ws = useRef(null)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(`${WEBSOCKET_URL}/chat/ws`)

      ws.current.onopen = () => {
        console.log("WebSocket connected")
      }

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === "token") {
          // streaming token — append to current message
          onToken && onToken(data.content)
        } else if (data.type === "done") {
          // streaming complete
          onDone && onDone(data.content)
        } else if (data.type === "typing") {
          // show typing indicator
          onMessage && onMessage({ type: "typing" })
        } else if (data.type === "error") {
          onMessage && onMessage({ type: "error", content: data.content })
        } else {
          // fallback for non streaming messages
          onMessage && onMessage(data)
        }
      }

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      ws.current.onclose = () => {
        console.log("WebSocket disconnected — reconnecting in 3s")
        reconnectTimer.current = setTimeout(connect, 3000)
      }
    } catch (err) {
      console.error("WebSocket connection failed:", err)
    }
  }, [onMessage, onToken, onDone])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      if (ws.current) ws.current.close()
    }
  }, [])

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      console.error("WebSocket not connected")
    }
  }

  return { sendMessage }
}

export default useWebSocket
