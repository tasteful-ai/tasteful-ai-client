import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Sidebar } from "./components/Sidebar";
import Main from "./pages/Main";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Location from "./pages/Location"; // ✅ 변경: Location 사용
import { connectWebSocket, disconnectWebSocket } from "./store/slices/chattingSlice";
import ChattingRoomList from "./pages/ChattingRoomList";
import ChattingRoom from "./pages/ChattingRoom";
import ChattingRoomCreate from "./pages/ChattingRoomCreate";
import AdminMain from "./pages/AdminMain";

function Layout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/signup" && location.pathname !== "/login"; // 회원가입/로그인 페이지에서는 사이드바 숨김

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />} {/* 사이드바 유지 */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/location" element={<Location />} /> {/* Location 사용 */}
          <Route path="/chatting/rooms" element={<ChattingRoomList />} />
          <Route path="/chatting/create" element={<ChattingRoomCreate />} />
          <Route path="/chatting/room/:roomId" element={<ChattingRoom />} />
          <Route path="/admin" element={<AdminMain />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectWebSocket()); // 앱 시작 시 WebSocket 연결

    return () => {
      dispatch(disconnectWebSocket()); // 앱 종료 시 WebSocket 연결 해제
    };
  }, [dispatch]);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
