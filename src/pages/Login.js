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
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("memberRole", response.data.data.memberRole);
      localStorage.setItem("memberId", response.data.data.memberId);
      localStorage.setItem("nickname", response.data.data.nickname);
  
      alert("로그인 성공!");
      window.dispatchEvent(new Event("storage"));
  
      // ✅ ADMIN인 경우 관리자 페이지로 리디렉트
      if (response.data.data.memberRole === "ADMIN") {
        navigate("/admin");
      } else {
        // 일반 사용자는 원래 가려고 했던 페이지나 메인 페이지로 이동
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
      }
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