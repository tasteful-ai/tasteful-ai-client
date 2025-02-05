import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import ChattingRoomCreateModal from "../components/ChattingRoomCreateModal.js";
import "../styles/Chatting.css";
import chatIcon from "../assets/9kcalTeamlogo.png";

const ChattingRoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error } = useSelector((state) => state.chatting);

  const isAdmin = localStorage.getItem("memberRole") === "ADMIN";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChattingRooms());
  }, [dispatch]);

  const refreshRooms = () => {
    dispatch(fetchChattingRooms());
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("이 채팅방을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/chatting/rooms/${roomId}`);
      alert("채팅방이 삭제되었습니다.");
      dispatch(fetchChattingRooms());
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
      dispatch(fetchChattingRooms());
    } catch (error) {
      alert("채팅방 이름 변경 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="chatting-room-list">
      <h1 className="chatting-title">오늘 뭐 먹지? 채팅</h1>

      {isAdmin && (
        <button className="add-room-button" onClick={() => setShowModal(true)}>
          + 채팅방 추가
        </button>
      )}

      {loading && <p>채팅방을 불러오는 중...</p>}
      {error && <p className="error-text">❌ 오류 발생: {error}</p>}

      <table className="chatting-table">
        <thead>
          <tr>
            <th>채팅방 이름</th>
            {isAdmin && <th>생성일</th>}
            {isAdmin && <th>관리자 닉네임</th>}
            {isAdmin && <th>관리</th>}
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                
                {/* ✅ 사용자와 관리자 공통 - 채팅방 이름 */}
                <td
                  className="clickable-room-name"
                  onClick={() => navigate(`/chatting/room/${room.id}`)}
                >
                  <img src={chatIcon} alt="Chat Icon" className="chat-room-icon" />
                  {room.roomName || room.name}
                </td>

                {/* ✅ 관리자만 생성일 표시 */}
                {isAdmin && <td>{new Date(room.createdAt).toLocaleDateString()}</td>}

                {/* ✅ 관리자만 "관리자 닉네임" 표시 */}
                {isAdmin && <td>{room.creatorNickname}</td>}

                {/* ✅ 관리자만 수정, 삭제 가능 */}
                {isAdmin && (
                  <td className="action-buttons">
                    <button
                      className="update-room-button"
                      onClick={() => handleUpdateRoomName(room.id, room.roomName)}
                    >
                      ✏️ 수정
                    </button>
                    <button
                      className="delete-room-button"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      🗑️ 삭제
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? "4" : "2"} className="empty-message">
                아직 생성된 채팅방이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && <ChattingRoomCreateModal onClose={() => setShowModal(false)} refreshRooms={refreshRooms} />}
    </div>
  );
};

export default ChattingRoomList;
