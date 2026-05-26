import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { springbootApi } from "../api/axiosConfig"
import MainLayout from "../layouts/MainLayout"
import ChatBubble from "../components/ChatBubble"
import LoadingSpinner from "../components/LoadingSpinner"
import AlertBanner from "../components/AlertBanner"
import useChat from "../hooks/useChat"
import '../styles/ChatPage.css'
const ChatPage = () => {
  const [input, setInput] = useState("")
  const [docsReady, setDocsReady] = useState(null)
  const { messages, loading, sendMessage, streamingContent } = useChat()
  const error = useSelector(state => state.chat.error)
  const bottomRef = useRef(null)

  // Check if docs are ready before allowing questions
  useEffect(() => {
    checkDocsReady()
  }, [])

  const checkDocsReady = async () => {
    try {
      const res = await springbootApi.get("/docs/ready")
      setDocsReady(res.data)
    } catch {
      setDocsReady({ allReady: false, totalDocs: 0 })
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  const handleSend = () => {
    if (!input.trim() || loading) return
    const question = input
    setInput("")
    sendMessage(question)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend()
  }

  // Show warning if no docs uploaded or still processing
  const showDocWarning = docsReady && (docsReady.totalDocs === 0 || !docsReady.allReady)

  return (
    <MainLayout>
      <div className="chat-layout">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
          <div>
            <h2 className="page-title" style={{ marginBottom: "2px" }}>Ask a Question</h2>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              {docsReady && `${docsReady.readyCount || 0} documents ready`}
            </p>
          </div>
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
              <LoadingSpinner/>
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Doc not ready warning */}
        {showDocWarning && (
          <AlertBanner
            message={docsReady.totalDocs === 0
              ? "No documents uploaded yet. Go to Upload Docs to add documents first."
              : `${docsReady.processingCount} document(s) still processing. Answers may be incomplete.`
            }
            type={docsReady.totalDocs === 0 ? "warning" : "info"}
          />
        )}

        <AlertBanner message={error} type="error"/>

        {/* Chat messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              Ask a question about your uploaded documents
            </div>
          )}
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg}/>
          ))}

          {/* Streaming message — shows tokens as they arrive */}
          {streamingContent && (
            <div className="chat-bubble-wrapper assistant">
              <div className="chat-bubble assistant">
                {streamingContent}
                <span style={{ display: "inline-block", width: "8px", height: "14px", background: "#94a3b8", marginLeft: "2px", animation: "blink 1s infinite" }}/>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {loading && !streamingContent && (
            <div className="chat-bubble-wrapper assistant">
              <div className="chat-bubble assistant">
                <LoadingSpinner/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="Ask a question about your documents..."
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="chat-send-btn"
          >
            Send
          </button>
        </div>
      </div>

      {/* Blinking cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </MainLayout>
  )
}

export default ChatPage
