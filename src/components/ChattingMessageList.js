import React, { useEffect, useRef } from "react";
import "../styles/Chatting.css";
import defaultProfile from "../assets/default_image.png"; // 기본 프로필 이미지

const ChattingMessageList = ({ messages }) => {
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.map((msg, index) => {
        const currentUser = localStorage.getItem("username");
        const isUserMessage = msg.sender === currentUser;

        return (
          <div key={index} className={`message ${isUserMessage ? "user" : "bot"}`}>
            <img
              src={msg.profileImage || defaultProfile}
              alt="프로필"
              className="chat-profile-image"
              onError={(e) => {
                console.log("Image Load Failed, using default:", e.target.src);
                e.target.src = defaultProfile;
              }}
            />
            <div className="message-content">
              <strong>{msg.sender || msg.senderNickname}:</strong> {msg.message}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChattingMessageList;
