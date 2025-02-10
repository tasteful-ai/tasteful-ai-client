import React, { useState } from "react";
import axios from "../api/api";
import "../styles/Chatting.css";

const ChattingRoomCreateModal = ({ onClose, refreshRooms }) => {
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    try {
      await axios.post("/api/chatting/rooms", { roomName });
      alert("채팅방이 생성되었습니다.");
      setRoomName(""); // 입력 필드 초기화
      onClose(); // 모달 닫기
      refreshRooms(); // 채팅방 목록 새로고침
    } catch (error) {
      alert("채팅방 생성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>채팅방 생성</h3>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="채팅방 이름 입력"
          className="room-input"
        />
        <div className="modal-buttons">
          <button className="create-room-button" onClick={handleCreateRoom}>생성</button>
          <button className="delete-room-button" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default ChattingRoomCreateModal;
