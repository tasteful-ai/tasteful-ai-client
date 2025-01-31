import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  fetchRoomMessages,
} from "../store/slices/chattingSlice";
import "../styles/Chatting.css";

const ChattingRoom = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chatting);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRoomMessages(roomId));
    dispatch(connectWebSocket(roomId));

    return () => {
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, roomId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(sendMessage(roomId, message));
      setMessage("");
    }
  };

  return (
    <div className="chatting-room">
      <h1>Chat Room {roomId}</h1>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChattingRoom;
