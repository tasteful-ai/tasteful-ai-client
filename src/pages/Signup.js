import React, { useState } from "react";
import axios from "../api/api"; // Axios 인스턴스
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Signup.css";

export const Signup = () => {
  const [formData, setFormData] = useState({
    memberRole: "USER",
    email: "",
    password: "",
    nickname: "",
    age: 1,
    genderRole: "MALE",
  });

  const [modalMessage, setModalMessage] = useState(""); // ✅ 모달 메시지
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태
  const navigate = useNavigate();

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
      await axios.post("/api/auth/signup", formData);
      
      // ✅ 회원가입 성공 모달 표시 후 로그인 페이지로 이동
      handleShow("✅ 회원가입이 완료되었습니다!");
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000); // 2초 후 로그인 페이지로 이동
    } catch (error) {
      handleShow(error.response?.data?.message || "❌ 회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* 라디오 버튼 그룹 */}
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="memberRole"
              value="USER"
              checked={formData.memberRole === "USER"}
              onChange={handleChange}
            />
            <span>일반 회원</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="memberRole"
              value="ADMIN"
              checked={formData.memberRole === "ADMIN"}
              onChange={handleChange}
            />
            <span>관리자</span>
          </label>
        </div>

        {/* 입력 필드 */}
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
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
          required
        />
        <select name="age" value={formData.age} onChange={handleChange} required>
          {Array.from({ length: 100 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <select name="genderRole" value={formData.genderRole} onChange={handleChange} required>
          <option value="MALE">남자</option>
          <option value="FEMALE">여자</option>
          <option value="OTHER">기타</option>
        </select>

        {/* 버튼 */}
        <button type="submit" className="signup-button">회원가입</button>

        {/* 하단 링크 */}
        <div className="signup-footer">
          <span>계정이 이미 있습니까? </span>
          <a href="/login">로그인</a>
        </div>
      </form>

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

export default Signup;
