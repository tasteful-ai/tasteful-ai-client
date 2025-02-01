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

      <div className="room-list">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="chat-room-item"
            onClick={() => navigate(`/chatting/room/${room.id}`)}          
          >
            <img src={chatIcon} alt="Chat Icon" className="chat-room-icon" />
            <span className="chat-room-name">{room.roomName || room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChattingRoomList;
