import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api"; // 커스텀 Axios 인스턴스 (필요시 기본 axios 사용 가능)

const ChattingRoomCreate = () => {
  const [roomName, setRoomName] = useState(""); // 채팅방 이름 상태 관리
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    try {
      const response = await axios.post("/api/chatting/room", {roomName: roomName}, {
        headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VydGVzdDEyM0BnbWFpbC5jb20iLCJpYXQiOjE3Mzc5NjYwNjMsImV4cCI6MTczNzk2OTY2M30.sHJOZrqOwPLA6W-7YoYO7Rni9wa0f-8l99K8IidnEKc'}
      });
      alert("채팅방 생성 성공!");
      navigate("/chatting/rooms"); // 채팅방 목록 페이지로 이동
    } catch (error) {
      alert("채팅방 생성 실패: " + error.response?.data?.message || "알 수 없는 오류");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>채팅방 생성</h1>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="채팅방 이름을 입력하세요"
        style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleCreateRoom} style={{ padding: "8px 16px" }}>
        생성
      </button>
    </div>
  );
};

export default ChattingRoomCreate;
