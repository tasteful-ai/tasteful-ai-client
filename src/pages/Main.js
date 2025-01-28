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
      <div className="menu-buttons">
        <button>오늘 점심메뉴 추천해줘</button>
        <button>지금 뭐 먹지?</button>
        <button>한식 중에 메뉴 추천해줘</button>
        <button>오늘 사람들이 많이 먹은 메뉴는 뭐야?</button>
        <button>오늘 저녁메뉴 추천해줘</button>
      </div>
      <div className="prompt-input">
        <input type="text" placeholder="type your prompt here" />
        <button>➔</button>
      </div>
    </div>
  );
};

export default Main;
