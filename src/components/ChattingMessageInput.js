import React from "react";

const ChattingMessageInput = ({ value, onChange, onSend }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="메시지를 입력하세요"
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={onSend} style={{ marginLeft: "10px", padding: "8px" }}>
        전송
      </button>
    </div>
  );
};

export default ChattingMessageInput;
