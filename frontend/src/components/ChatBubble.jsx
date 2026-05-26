import "../styles/ChatBubble.css"

const ChatBubble = ({ message }) => {
  const isUser = message.role === "user"
  return (
    <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-assistant"}`}>
      <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
        {message.content}
      </div>
    </div>
  )
}

export default ChatBubble