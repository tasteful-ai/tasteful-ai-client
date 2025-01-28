import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Counter } from "./pages/Counter";
import { Login } from "./pages/Login";
import { SamplePage } from "./pages/SamplePage";
import ChattingRoomList from "./pages/ChattingRoomList";
import ChattingRoomCreate from "./pages/ChattingRoomCreate";
import ChattingRoom from "./pages/ChattingRoom";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">홈</Link></li>
          <li><Link to="/sample">샘플페이지</Link></li>
          <li><Link to="/counter">숫자세는페이지</Link></li>
          <li><Link to="/login">숫자세는페이지</Link></li>
          <li><Link to="/chatting/rooms">채팅방 목록</Link></li>
          <li><Link to="/chatting/create">채팅방 생성</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>홈(메인페이지)</h1>} />
        <Route path="/sample" element={<SamplePage />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatting/rooms" element={<ChattingRoomList />} />
        <Route path="/chatting/create" element={<ChattingRoomCreate />} />
        <Route path="/chatting/:roomId" element={<ChattingRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
