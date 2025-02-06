import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearTokens } from "../store/slices/authSlice"; // ✅ Redux 상태 초기화
import "../styles/MypageSidebar.css";

const MypageSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Redux 디스패치 추가

  const handleLogout = () => {
    console.log("✅ 로그아웃 처리 시작");

    // ✅ Redux 상태 초기화
    dispatch(clearTokens());

    // ✅ LocalStorage & SessionStorage 완전 초기화
    localStorage.clear();
    sessionStorage.clear();

    console.log("✅ 로그아웃 완료, 로그인 페이지로 이동");
    window.location.replace("/login");
  };

  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar mypage-sidebar ${isOpen ? "open" : "closed"}`}>
        <h2 className="mypage-title" onClick={() => navigate("/")}>Home</h2>

        <div className="mypage-buttons">
          <button className="mypage-btn" onClick={() => navigate("/mypage/change-password")}>
            비밀번호 변경
          </button>
          <button className="mypage-btn" onClick={handleLogout}>
            로그아웃
          </button>
          <button className="mypage-btn delete" onClick={() => navigate("/account/delete")}>
            회원 탈퇴
          </button>
        </div>
      </aside>
    </>
  );
};

export default MypageSidebar;
