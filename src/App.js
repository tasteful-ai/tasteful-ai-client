import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Sidebar } from "./components/Sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import Main from "./pages/Main";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Location from "./pages/Location";
import { connectWebSocket, disconnectWebSocket } from "./store/slices/chattingSlice";
import ChattingRoomList from "./pages/ChattingRoomList";
import ChattingRoom from "./pages/ChattingRoom";
import ChattingRoomCreate from "./pages/ChattingRoomCreate";
import Mypage from "./pages/Mypage";
import UpdateProfile from "./pages/UpdateProfile";
import AdminMain from "./pages/AdminMain";
import MembersList from "./pages/MembersList";
import ChangePassword from "./pages/ChangePassword";

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/change-password"; 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("memberRole");
    setIsAdmin(role === "ADMIN");
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {!isAuthPage && (isAdmin ? (
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      ) : (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      ))}

      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/location" element={<Location />} />
          <Route path="/chatting/rooms" element={<ChattingRoomList />} />
          <Route path="/chatting/create" element={<ChattingRoomCreate />} />
          <Route path="/chatting/room/:roomId" element={<ChattingRoom />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/members" element={<MembersList />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkRoomsAndConnect = async () => {
      try {
        const response = await fetch("/api/chatting/rooms"); // 채팅방 목록 조회
        const data = await response.json();

        if (data.length > 0) {
          dispatch(connectWebSocket()); // 채팅방이 있으면 WebSocket 연결
        } else {
          console.warn("채팅방이 없어 WebSocket을 연결하지 않습니다.");
        }
      } catch (error) {
        console.error("채팅방 조회 실패:", error);
      }
    };

    checkRoomsAndConnect();

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
