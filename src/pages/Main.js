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
        Make personalized menu decisions with an AI agent specializing in menu recommendations. <br />
        Enter the food keyword you want to eat and check the list of popular restaurants around you.
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
