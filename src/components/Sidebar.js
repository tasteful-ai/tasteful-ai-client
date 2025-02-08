import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./../styles/Sidebar.css";
import { clearTokens } from "../store/slices/authSlice";
import homeLogo from "../assets/9kcalhome.png";
import mypageIcon from "../assets/9kcalmypage.png";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    setIsLoggedIn(!!accessToken);
  }, [accessToken]);

  const handleLogout = () => {
    console.log("✅ 로그아웃 처리 시작");
    dispatch(clearTokens());
    localStorage.clear();
    sessionStorage.clear();
    console.log("✅ 로그아웃 완료, 메인 페이지로 이동");
    window.location.replace("/");
    setIsLoggedIn(false);
  };

  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>☰</button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* 🔥 홈 로고를 사이드바 상단 오른쪽으로 배치 */}
        <div className="sidebar-header">
          <img src={homeLogo} alt="Home" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/chatting/room/ai")}>
            Begin a New AI Chat <span className="add-icon">+</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/location")}>주변 맛집 검색</button>
          <button className="nav-item" onClick={() => navigate("/chatting/rooms")}>오먹 채팅</button>
        </nav>

        <div className="sidebar-footer">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          ) : (
            <a href="/login">회원가입 / 로그인</a>
          )}
          <button className="settings-icon" onClick={() => navigate("/mypage")}>
            <img src={mypageIcon} alt="My Page" className="user-icon" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
