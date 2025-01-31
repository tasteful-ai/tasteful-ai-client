import React, { useState } from "react";
import axios from "../api/api"; // Axios 인스턴스
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // 로그인 전 방문하려던 페이지 정보 저장

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token); // 로그인 성공 시 토큰 저장

      alert("로그인 성공!");

      // ✅ localStorage 변경 이벤트 발생 → Sidebar에서 즉시 로그인 상태 반영됨
      window.dispatchEvent(new Event("storage"));

      // ✅ 사용자가 원래 가려고 했던 페이지가 있으면 해당 경로로 이동, 없으면 메인 화면으로 이동
      const redirectTo = location.state?.redirectTo || "/";
      navigate(redirectTo);

    } catch (error) {
      setError(error.response?.data?.message || "로그인에 실패했습니다.");
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
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="login-footer">
        <span>계정이 없으신가요? </span>
        <a href="/signup">회원가입</a>
      </div>
    </div>
  );
};
