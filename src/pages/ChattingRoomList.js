import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Chatting.css";

const ChattingRoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error } = useSelector((state) => state.chatting);

  useEffect(() => {
    dispatch(fetchChattingRooms());
  }, [dispatch]);

  return (
    <div className="chatting-room-list">
      <h1 className="chatting-title">오먹채팅</h1>
      <div className="room-list">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="chat-room-item"
            onClick={() => navigate(`/chatting/room/${room.id}`)}          >
            <img src="/chat-icon.png" alt="Chat Icon" className="chat-room-icon" />
            <span className="chat-room-name">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChattingRoomList;
