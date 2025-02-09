import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearTokens } from "../store/slices/authSlice";
import "../styles/MypageSidebar.css";
import homeLogo from "../assets/9kcalhome.png"; // ✅ homeLogo 불러오기

const MypageSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("✅ 로그아웃 처리 시작");

    dispatch(clearTokens());

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
        <div className="sidebar-header">
          {/* ✅ 홈 로고 추가 (클릭 시 메인 페이지 이동) */} 
          <img
            src={homeLogo}
            alt="Home"
            className="mypagesidebar-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", width: "100px", marginBottom: "10px" }} // ✅ 크기 및 스타일 조정
          />
        </div>

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
