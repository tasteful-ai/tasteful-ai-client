import React from "react";

const ChattingMessageList = ({ messages }) => {
  return (
    <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px" }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChattingMessageList;
