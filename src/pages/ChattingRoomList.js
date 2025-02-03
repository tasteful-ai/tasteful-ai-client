import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
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

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("이 채팅방을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/chatting/rooms/${roomId}`);
      alert("채팅방이 삭제되었습니다.");
      dispatch(fetchChattingRooms()); // 채팅방 목록 새로고침
    } catch (error) {
      alert("채팅방 삭제 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  const handleUpdateRoomName = async (roomId, currentName) => {
    const newRoomName = prompt("새로운 채팅방 이름을 입력하세요:", currentName);
    if (!newRoomName || newRoomName.trim() === currentName) return;

    try {
      await axios.patch(`/api/chatting/rooms/${roomId}`, { roomName: newRoomName });
      alert("채팅방 이름이 변경되었습니다.");
      dispatch(fetchChattingRooms()); // 채팅방 목록 새로고침
    } catch (error) {
      alert("채팅방 이름 변경 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };
  
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
            <div key={room.id} className="chat-room-item">
              <img src={chatIcon} alt="Chat Icon" className="chat-room-icon" />
              <span className="chat-room-name" onClick={() => navigate(`/chatting/room/${room.id}`)}>
                {room.roomName || room.name}
              </span>
              {isAdmin && (
                <div className="admin-room-controls">
                <button className="update-room-button" onClick={() => handleUpdateRoomName(room.id, room.roomName)}>
                  ✏️ 수정
                </button>
                <button className="delete-room-button" onClick={() => handleDeleteRoom(room.id)}>
                  🗑️ 삭제
                </button>
              </div>
              )}
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
