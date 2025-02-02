import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Redux 상태 사용
import "./../styles/Sidebar.css";
import { clearTokens } from "../store/slices/authSlice";

export const Sidebar = ({isOpen, toggleSidebar}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 변경 감지
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // 토큰 삭제
    dispatch(clearTokens()); // Redux 상태 업데이트
    setIsLoggedIn(false); // 로컬 상태 업데이트
    navigate("/"); // 홈으로 이동
  };
  
  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>☰</button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item">Begin a New AI Chat <span className="add-icon">+</span></button>
          <button className="nav-item" onClick={() => navigate("/location")}>주변 맛집 검색</button>
          <button className="nav-item" onClick={() => navigate("/chatting/rooms")}>오먹 채팅</button>
        </nav>

        <div className="sidebar-footer">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          ) : (
            <a href="/login">회원가입 / 로그인</a>
          )}
          <button className="settings-icon" onClick={() => navigate("/mypage")}>⚙</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;