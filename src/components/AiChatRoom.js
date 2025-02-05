import React, { useState } from "react";
import { sendChatMessage } from "../api/aiChatApi";
import "../styles/aiChatRoom.css"; 

const AiChatRoom = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, name: "닉네임" }; 
    setMessages((prevMessages) => [...prevMessages, userMessage]); // ✅ 사용자 메시지 추가 (현재 상태 유지)
    setInput(""); // ✅ 입력 필드 초기화

    try {
      const aiResponse = await sendChatMessage(input);
      const aiMessage = { sender: "ai", text: aiResponse, name: "빠쏘 AI" };

      setMessages((prevMessages) => [...prevMessages, aiMessage]); // ✅ AI 응답 추가 (사용자 메시지를 다시 추가하지 않음)
    } catch (error) {
      console.error("❌ AI 응답 오류:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AI 채팅</div>
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
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default AiChatRoom;
