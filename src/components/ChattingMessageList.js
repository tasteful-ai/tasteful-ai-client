import React from "react";
import "../styles/Chatting.css";

const ChattingMessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === localStorage.getItem("username") ? "user" : "bot"}`}>
          <strong>{msg.sender}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ChattingMessageList;
