import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "../styles/Chatting.css";

const ChattingRoomCreate = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    try {
      await axios.post("/api/chatting/room", { roomName });
      alert("Room created successfully!");
      navigate("/chatting/rooms");
    } catch (error) {
      alert("채팅방 생성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="chatting-room-create">
      <h1>Create Chat Room</h1>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name"
        className="room-input"
      />
      <button onClick={handleCreateRoom} className="create-room-button">
        Create
      </button>
    </div>
  );
};

export default ChattingRoomCreate;
