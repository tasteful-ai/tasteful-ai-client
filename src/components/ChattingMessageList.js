import React, { useEffect, useRef } from "react";
import "../styles/Chatting.css";

const ChattingMessageList = ({ messages }) => {
  const scrollRef = useRef(null);
  const messageListRef = useRef(null); // 채팅 목록 컨테이너 ref

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`message ${msg.sender === localStorage.getItem("username") ? "user" : "bot"}`}
          ref={index === messages.length - 1 ? scrollRef : null} // 마지막 메시지에 ref 적용
        >
          <strong>{msg.sender || msg.senderNickname}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ChattingMessageList;
