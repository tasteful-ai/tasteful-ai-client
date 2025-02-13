import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendChatMessage } from "../api/aiChatApi";
import "../styles/aiChatRoom.css"; 
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AiChatRoom = () => {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem("chatMessages")) || []);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "닉네임");
  const navigate = useNavigate();
  const alertShown = useRef(false);
  const messageListRef = useRef(null);
  const isSending = useRef(false); // ✅ 중복 요청 방지

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("message");

    const isFirst = localStorage.getItem("isFirst");

    if (message && isFirst === "true") {

      localStorage.setItem("isFirst", false);

      const sendFirstMessage = async () => {
        isSending.current = true; // ✅ 중복 실행 방지 플래그

        const messageToSend = message.trim();
        setInput(""); 

        const userMessage = { sender: "user", text: messageToSend, name: nickname };

        // ✅ 로컬 스토리지 및 상태 업데이트 (사용자 메시지 추가)
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, userMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
          return updatedMessages;
        });

        try {
          const aiResponse = await sendChatMessage(messageToSend);

          if (aiResponse) {
            const aiMessage = {
              sender: "ai",
              text: `${aiResponse.recommendation}\n\n📌 설명: ${aiResponse.description}`, // ✅ description 추가
              name: "9KcAI",
            };

            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, aiMessage];
              localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
              return updatedMessages;
            });
          }
        } catch (error) {
          console.error("❌ AI 응답 오류:", error);
        } finally {
          isSending.current = false; // ✅ 중복 실행 방지 플래그 해제
        }
      }
      sendFirstMessage();
    }
  }, [])

  const handleClose = () => setShowModal(false);

  const handleShow = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // ✅ 채팅 히스토리 불러오기 (최초 1회 실행)
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !alertShown.current) {
      alertShown.current = true;
      handleShow("로그인이 필요합니다.");
    }
  }, []);

  // ✅ 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isSending.current) return; // ✅ 빈 메시지 & 중복 실행 방지
    isSending.current = true; // ✅ 중복 실행 방지 플래그

    const messageToSend = input.trim();
    // setInput(""); 
    setTimeout(() => setInput(""), 0);

    const userMessage = { sender: "user", text: messageToSend, name: nickname };

    // ✅ 로컬 스토리지 및 상태 업데이트 (사용자 메시지 추가)
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    try {
      const aiResponse = await sendChatMessage(messageToSend);

      if (aiResponse) {
        const aiMessage = {
          sender: "ai",
          text: `${aiResponse.recommendation}\n\n📌 설명: ${aiResponse.description}`, // ✅ description 추가
          name: "9KcAI",
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, aiMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("❌ AI 응답 오류:", error);
    } finally {
      isSending.current = false; // ✅ 중복 실행 방지 플래그 해제
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
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
