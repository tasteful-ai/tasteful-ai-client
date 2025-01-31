import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./../styles/AdminSidebar.css"; // 관리자용 CSS
import { clearTokens } from "../store/slices/authSlice";

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(clearTokens());
    setIsLoggedIn(false);
    navigate("/"); // 로그아웃 후 홈으로 이동
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <button className="menu-icon">☰</button>
        <h2 className="admin-mode-title">관리자 모드</h2>
      </div>
      <nav className="sidebar-nav">
        <button className="nav-item" onClick={() => navigate("/user/list")}>사용자 목록</button>
        <button className="nav-item" onClick={() => navigate("/chatting/rooms")}>채팅방 관리</button>
      </nav>
      <div className="sidebar-footer">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        ) : (
          <a href="/signup">회원가입 / 로그인</a>
        )}
        <button className="settings-icon" onClick={() => navigate("/admin/settings")}>⚙</button>
      </div>
    </aside>
  );
};

