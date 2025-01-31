import React from "react";
import "./../styles/Main.css"; // CSS 경로 확인
import logo from "./../assets/9kcalTeamlogo.png"; // 올바른 로고 이미지 경로

const Main = () => {
  return (
    <div className="main-container">
      <div className="main-logo">
        <img src={logo} alt="logo" className="logo-image" /> {/* 로고 이미지 */}
      </div>
      <h1 className="main-title">오늘 뭐 먹지?</h1>
      <p className="main-description">
        Elevate your dining experience with our AI-powered menu recommendations. <br />
        Discover personalized suggestions tailored to your unique tastes, <br />
        explore the map, and uncover the perfect spot to indulge in unforgettable flavors.
      </p>
      {/* ✅ 입력창 삭제됨 */}
    </div>
  );
};

export default Main;
