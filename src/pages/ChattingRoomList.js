import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChattingRooms } from "../store/slices/chattingSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import ChattingRoomCreateModal from "../components/ChattingRoomCreateModal.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/Chatting.css";
import chatIcon from "../assets/9kcalTeamlogo.png";

const ChattingRoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, error } = useSelector((state) => state.chatting);
  const isAdmin = localStorage.getItem("memberRole") === "ADMIN";
  const [showModal, setShowModal] = useState(false);
  const alertShown = useRef(false); // ✅ 중복 실행 방지

  // ✅ 모달 상태 추가
  const [modalType, setModalType] = useState(""); // "delete", "update", "alert"
  const [modalMessage, setModalMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !alertShown.current) {
      alertShown.current = true; 
      setModalType("alert");
      setModalMessage("로그인이 필요합니다.");
      setShowConfirmModal(true);
    } else {
      dispatch(fetchChattingRooms());
    }
  }, [dispatch, navigate]);

  const refreshRooms = () => {
    dispatch(fetchChattingRooms());
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setModalType("delete");
    setModalMessage(`"${room.roomName}" 채팅방을 삭제하시겠습니까?`);
    setShowConfirmModal(true);
  };

  const handleUpdateRoomName = (room) => {
    setSelectedRoom(room);
    setModalType("update");
    setModalMessage("새로운 채팅방 이름을 입력하세요:");
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (modalType === "delete" && selectedRoom) {
      try {
        await axios.delete(`/api/chatting/rooms/${selectedRoom.id}`);
        setModalMessage("✅ 채팅방이 삭제되었습니다!");
        dispatch(fetchChattingRooms());
      } catch (error) {
        setModalMessage("❌ 채팅방 삭제 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    } else if (modalType === "update" && selectedRoom) {
      const newRoomName = prompt("새로운 채팅방 이름을 입력하세요:", selectedRoom.roomName);
      if (!newRoomName || newRoomName.trim() === selectedRoom.roomName) return;

      try {
        await axios.patch(`/api/chatting/rooms/${selectedRoom.id}`, { roomName: newRoomName });
        setModalMessage("✅ 채팅방 이름이 변경되었습니다!");
        dispatch(fetchChattingRooms());
      } catch (error) {
        setModalMessage("❌ 채팅방 이름 변경 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    } else if (modalType === "alert") {
      navigate("/login");
    }

    setShowConfirmModal(false);
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
                <td className="clickable-room-name" onClick={() => navigate(`/chatting/room/${room.id}`)}>
                  <img src={chatIcon} alt="Chat Icon" className="chat-room-icon" />
                  {room.roomName || room.name}
                </td>

                {isAdmin && <td>{new Date(room.createdAt).toLocaleDateString()}</td>}
                {isAdmin && <td>{room.creatorNickname}</td>}

                {isAdmin && (
                  <td className="action-buttons">
                    <button className="update-room-button" onClick={() => handleUpdateRoomName(room)}>
                      ✏️ 수정
                    </button>
                    <button className="delete-room-button" onClick={() => handleDeleteRoom(room)}>
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

      {/* ✅ 모달 컴포넌트 */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {modalType === "alert" ? (
            <Button variant="primary" onClick={confirmAction}>
              확인
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                취소
              </Button>
              <Button variant="danger" onClick={confirmAction}>
                확인
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChattingRoomList;
