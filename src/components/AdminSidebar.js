import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Redux 상태 가져오기
import "./../styles/AdminSidebar.css"; // 관리자용 CSS
import { clearTokens } from "../store/slices/authSlice";

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken); // ✅ Redux에서 accessToken 상태 가져오기
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  // ✅ Redux 상태 변경 감지하여 로그인 상태 업데이트
  useEffect(() => {
    setIsLoggedIn(!!accessToken);
  }, [accessToken]); // ✅ accessToken이 변경될 때마다 실행

  // 로그아웃 처리
  const handleLogout = () => {
    console.log("✅ 로그아웃 처리 시작");

    // ✅ Redux 상태 초기화
    dispatch(clearTokens());

    // ✅ LocalStorage 및 SessionStorage 전체 삭제
    localStorage.clear();
    sessionStorage.clear();

    console.log("✅ 로그아웃 완료, 메인 페이지로 이동");
    window.location.replace("/");

    // ✅ 상태 즉시 업데이트
    setIsLoggedIn(false);
  };

  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="admin-mode-title">관리자 모드</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/members")}>사용자 목록</button>
          <button className="nav-item" onClick={() => navigate("/chatting/rooms")}>채팅방 관리</button>
        </nav>
        <div className="sidebar-footer">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>회원가입 / 로그인</button>
          )}
          <button className="settings-icon" onClick={() => navigate("/mypage")}>⚙</button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
