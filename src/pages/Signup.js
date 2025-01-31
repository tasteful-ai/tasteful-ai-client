import React, { useState } from "react";
import axios from "../api/api"; // Axios 인스턴스
import { useNavigate } from "react-router-dom";
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

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/auth/signup", formData);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "회원가입에 실패했습니다.");
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
        <select
          name="genderRole"
          value={formData.genderRole}
          onChange={handleChange}
          required
        >
          <option value="MALE">남자</option>
          <option value="FEMALE">여자</option>
          <option value="OTHER">기타</option>
        </select>

        {/* 버튼 */}
        <button type="submit" className="signup-button">
          회원가입
        </button>
        {error && <p className="error-message">{error}</p>}

        {/* 하단 링크 */}
        <div className="signup-footer">
          <span>계정이 이미 있습니까? </span>
          <a href="/login">로그인</a>
        </div>
      </form>
    </div>
  );
};
