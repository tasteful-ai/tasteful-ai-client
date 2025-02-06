import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Redux 상태 사용
import "./../styles/Sidebar.css";
import { clearTokens } from "../store/slices/authSlice";

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken); // ✅ Redux에서 accessToken 상태 가져오기
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  // ✅ Redux 상태 변경 감지하여 로그인 상태 업데이트
  useEffect(() => {
    setIsLoggedIn(!!accessToken); // Redux 상태 기반으로 업데이트
  }, [accessToken]); // ✅ accessToken이 변경될 때마다 실행

  const handleLogout = () => {
    console.log("✅ 로그아웃 처리 시작");

    // ✅ Redux 상태 초기화
    dispatch(clearTokens());

    // ✅ LocalStorage 및 SessionStorage 초기화
    localStorage.clear();
    sessionStorage.clear();

    console.log("✅ 로그아웃 완료, 메인 페이지로 이동");
    navigate("/");

    // ✅ 상태 즉시 업데이트
    setIsLoggedIn(false);
  };

  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>☰</button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header"></div>
        <nav className="sidebar-nav">
          {/* ✅ AI 채팅방 이동 버튼 */}
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
          <button className="settings-icon" onClick={() => navigate("/mypage")}>⚙</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
