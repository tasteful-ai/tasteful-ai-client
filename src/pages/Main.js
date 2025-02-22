import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Main.css"; // CSS 경로 확인
import logo from "./../assets/9kcalTeamlogo.png"; // 올바른 로고 이미지 경로

const Main = () => {
  const [input, setInput] = useState(""); // 입력 상태 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleNavigateToChat = () => {
    if (!input.trim()) return; // 빈 입력값 방지

    localStorage.setItem("isFirst", true);

    navigate(`/chatting/room/ai?message=${encodeURIComponent(input)}`); // AI 채팅방으로 이동
  };

  const buttonRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      buttonRef.current.click();
    }
  };

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
        <button onClick={() => setInput("오늘 점심메뉴 추천해줘")}>오늘 점심메뉴 추천해줘</button>
        <button onClick={() => setInput("지금 뭐 먹지?")}>지금 뭐 먹지?</button>
        <button onClick={() => setInput("한식 중에 메뉴 추천해줘")}>한식 중에 메뉴 추천해줘</button>
        <button onClick={() => setInput("오늘 사람들이 많이 먹은 메뉴는 뭐야?")}>오늘 사람들이 많이 먹은 메뉴는 뭐야?</button>
        <button onClick={() => setInput("오늘 저녁메뉴 추천해줘")}>오늘 저녁메뉴 추천해줘</button>
      </div>
      <div className="prompt-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type your prompt here"
        />
        <button ref={buttonRef} onClick={handleNavigateToChat}>➔</button> {/* 클릭 시 채팅방으로 이동 */}
      </div>
    </div>
  );
};

export default Main;
