import React from "react";
import { useNavigate, useLocation } from "react-router-dom";  // useLocation 추가

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();  // useLocation 훅을 사용해 현재 경로를 추적

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <button className="menu-icon">☰</button>
      </div>
      <nav className="sidebar-nav">
        <button
          className="nav-item"
          onClick={() => location.pathname !== "/admin/dashboard" && navigate("/admin/dashboard")}
        >
          대시보드
        </button>
        <button className="nav-item" onClick={() => navigate("/user/list")}>
          사용자 목록
        </button>
        <button className="nav-item" onClick={() => navigate("/chatting/rooms")}>
          채팅방 관리
        </button>
      </nav>
      <div className="sidebar-footer">
        <button onClick={() => navigate("/login")}>로그아웃</button>
      </div>
    </aside>
  );
};
