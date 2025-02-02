import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Chatting.css";
import chatIcon from "../assets/9kcalTeamlogo.png";

const ChattingRoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error } = useSelector((state) => state.chatting);

  const isAdmin = localStorage.getItem("memberRole") === "ADMIN";

  useEffect(() => {
    dispatch(fetchChattingRooms());
  }, [dispatch]);

  return (
    <div className="chatting-room-list">
      <h1 className="chatting-title">오먹채팅</h1>
      {isAdmin && (
        <button 
          className="create-room-button" 
          onClick={() => navigate("/chatting/create")}
        >
          + 채팅방 생성
        </button>
      )}

      {loading && <p>채팅방을 불러오는 중...</p>}

      {error && <p className="error-text">❌ 오류 발생: {error}</p>}

      <div className="room-list">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div 
              key={room.id} 
              className="chat-room-item"
              onClick={() => navigate(`/chatting/room/${room.id}`)}          
            >
              <img src={chatIcon} alt="Chat Icon" className="chat-room-icon" />
              <span className="chat-room-name">{room.roomName || room.name}</span>
            </div>
          ))
        ) : (
          <p className="empty-message">아직 생성된 채팅방이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ChattingRoomList;
