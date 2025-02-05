import React, { useState } from "react";
import { sendChatMessage } from "../api/aiChatApi";
import "../styles/aiChatRoom.css"; 

const AiChatRoom = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, name: "닉네임" }; // ✅ 사용자 닉네임 추가
    setMessages([...messages, userMessage]);
    setInput("");

    const aiResponse = await sendChatMessage(input);
    const aiMessage = { sender: "ai", text: aiResponse, name: "빠쓰 AI" }; // ✅ AI 이름 추가
    setMessages([...messages, userMessage, aiMessage]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AI Chat</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-box ${msg.sender === "user" ? "user-msg" : "ai-msg"}`}>
            <span className="nickname">{msg.name}</span>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={() => handleSendMessage(input)}>전송</button>
      </div>
    </div>
  );
};

export default AiChatRoom;
