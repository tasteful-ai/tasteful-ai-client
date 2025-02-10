import React from "react";
import "../styles/Chatting.css";

const ChattingMessageInput = ({ value, onChange, onSend }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type your message..."
        className="message-input"
      />
      <button onClick={onSend} className="send-button">
        Send
      </button>
    </div>
  );
};

export default ChattingMessageInput;
