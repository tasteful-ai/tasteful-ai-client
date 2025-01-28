import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { Link, useNavigate } from "react-router-dom";

const ChattingRoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error } = useSelector((state) => state.chatting);

  useEffect(() => {
    // 채팅방 목록 데이터를 불러오기
    dispatch(fetchChattingRooms());
  }, [dispatch]);

  const handleCreateRoom = () => {
    // 채팅방 생성 페이지로 이동
    navigate("/chatting/create");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>채팅방 목록</h1>
      <button
        onClick={handleCreateRoom}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        채팅방 생성
      </button>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id} style={{ margin: "10px 0" }}>
            <Link to={`/chatting/room/${room.id}`} style={{ textDecoration: "none", color: "#007BFF" }}>
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChattingRoomList;
