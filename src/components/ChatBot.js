import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../api/aiChatApi";
import "../styles/aiChatRoom.css"; 
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AiChatRoom = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("닉네임");
  const navigate = useNavigate();
  const alertShown = useRef(false);
  const messageListRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleClose = () => setShowModal(false);

  const handleShow = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // ✅ 채팅 히스토리 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedNickname = localStorage.getItem("nickname");

    if (!accessToken && !alertShown.current) {
      alertShown.current = true;
      handleShow("로그인이 필요합니다.");
    }

    if (storedNickname) {
      setNickname(storedNickname);
    }

    // ✅ 로컬 스토리지에서 저장된 채팅 불러오기
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(storedMessages);
  }, []);

  // ✅ 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, name: nickname };
    
    // ✅ 로컬 스토리지에 채팅 히스토리 저장
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setInput("");

    try {
      const aiResponse = await sendChatMessage(input);
      const aiMessage = { sender: "ai", text: aiResponse, name: "9KcAI" };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, aiMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

    } catch (error) {
      console.error("❌ AI 응답 오류:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">AI Chat</div>
      <div className="chatbot-messages" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-box ${msg.sender === "user" ? "user-msg" : "ai-msg"}`}>
            <span className="nickname">{msg.name}</span>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>

      {/* ✅ 로그인 안내 모달 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/login")}>
            로그인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AiChatRoom;
