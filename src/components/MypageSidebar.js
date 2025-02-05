import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MypageSidebar.css";

const MypageSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <>
      <button className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar mypage-sidebar ${isOpen ? "open" : "closed"}`}>
        <h2 className="mypage-title" onClick={() => navigate("/")}>Home</h2>

        <div className="mypage-buttons">
          <button className="mypage-btn" onClick={() => navigate("/mypage/change-password")}>비밀번호 변경</button>
          <button className="mypage-btn" onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/login");
          }}>로그아웃</button>
          <button className="mypage-btn delete" onClick={() => navigate("/mypage/delete")}>회원 탈퇴</button>
        </div>
      </aside>
    </>
  );
};

export default MypageSidebar;
