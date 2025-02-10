import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "../styles/Chatting.css";

const ChattingRoomCreate = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("memberRole") === "ADMIN";

  const handleCreateRoom = async () => {
    if (!isAdmin) {
      alert("관리자만 채팅방을 생성할 수 있습니다.");
      return;
    }

    if (!roomName.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    try {
      await axios.post("/api/chatting/rooms", { roomName });
      alert("Room created successfully!");
      navigate("/chatting/rooms");
    } catch (error) {
      alert("채팅방 생성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="chatting-room-create">
      <h1>Create Chat Room</h1>
      {isAdmin ? (
        <>
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
        </>
      ) : (
        <p className="error-message">🚫 관리자만 채팅방을 생성할 수 있습니다.</p>
      )}
    </div>
  );
};

export default ChattingRoomCreate;
