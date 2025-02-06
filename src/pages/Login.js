import React, { useState } from "react";
import axios from "../api/api"; // Axios 인스턴스
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Login.css";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modalMessage, setModalMessage] = useState(""); // ✅ 모달 메시지
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  const navigate = useNavigate();
  const location = useLocation(); // 로그인 전 방문하려던 페이지 정보 저장

  const handleClose = () => setShowModal(false); // 모달 닫기
  const handleShow = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("memberRole", response.data.data.memberRole);
      localStorage.setItem("memberId", response.data.data.memberId);
      localStorage.setItem("nickname", response.data.data.nickname);

      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        setShowModal(false);
        if (response.data.data.memberRole === "ADMIN") {
          navigate("/admin");
        } else {
          const redirectTo = location.state?.redirectTo || "/";
          navigate(redirectTo);
        }
      },
    );
    } catch (error) {
      handleShow(error.response?.data?.message || "❌ 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
      <div className="login-footer">
        <span>계정이 없으신가요? </span>
        <a href="/signup">회원가입</a>
      </div>

      {/* ✅ 모달 컴포넌트 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
