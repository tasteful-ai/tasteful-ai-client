import React from "react";
import "./../styles/Sidebar.css"; // Sidebar 스타일 연결

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="menu-icon">☰</button>
      </div>
      <nav className="sidebar-nav">
        <button className="nav-item">Begin a New AI Chat <span className="add-icon">+</span></button>
        <button className="nav-item">주변 맛집 검색</button>
        <button className="nav-item">오먹 채팅</button>
      </nav>
      <div className="sidebar-footer">
        <a href="/signup">회원가입 / 로그인</a>
        <button className="settings-icon">⚙</button>
      </div>
    </aside>
  );
};
