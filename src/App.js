import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTokens } from "./store/slices/authSlice";
import { Sidebar } from "./components/Sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import MypageSidebar from "./components/MypageSidebar"
import Main from "./pages/Main";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Location from "./pages/Location";
import { connectWebSocket, disconnectWebSocket } from "./store/slices/chattingSlice";
import ChattingRoomList from "./pages/ChattingRoomList";
import ChattingRoom from "./pages/ChattingRoom";
import ChattingRoomCreate from "./pages/ChattingRoomCreate";
import Mypage from "./pages/Mypage";
import ProfileSettings from "./pages/ProfileSettings";
import UpdateProfile from "./pages/UpdateProfile";
import AdminMain from "./pages/AdminMain";
import MembersList from "./pages/MembersList";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot"; // ✅ AI 챗봇 추가
import TasteSelection from "./pages/TasteSelection";

function Layout() {
  const location = useLocation();
  const authPages = ["/change-password", "/forgot-password"]; // ✅ 인증 관련 페이지 배열화
  const isAuthPage = authPages.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const isMypage = location.pathname.startsWith("/mypage");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const role = localStorage.getItem("memberRole");
    setIsAdmin(role === "ADMIN");
  }, []);

  return (
    <div className={`layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {!isAuthPage && (
        isMypage ? (
          <MypageSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        ) : isAdmin ? (
          <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        ) : (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )
      )}

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
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* ✅ AI 채팅방 추가 */}
          <Route path="/chatting/room/ai" element={<ChatBot />} />

          {/* ADMIN 전용 페이지 보호 */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminMain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute>
                <MembersList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const memberRole = useSelector((state) => state.auth.memberRole);
  const isConnected = useSelector((state) => state.chatting.isConnected); // ✅ WebSocket 연결 상태 확인

  useEffect(() => {
    const role = localStorage.getItem("memberRole");
    const token = localStorage.getItem("accessToken");

    if (role && token) {
      dispatch(setTokens({ accessToken: token, memberRole: role })); // Redux 상태에 저장
    }
  }, [dispatch]);

  useEffect(() => {
    const checkRoomsAndConnect = async () => {
      try {
        const response = await fetch("/api/chatting/rooms"); // 채팅방 목록 조회
        const data = await response.json();

        if (data.length > 0 && !isConnected) {
          dispatch(connectWebSocket()); // ✅ 이미 연결되지 않았다면 WebSocket 연결
        }
      } catch (error) {
        console.error("채팅방 조회 실패:", error);
      }
    };

    checkRoomsAndConnect();

    return () => {
      if (isConnected) {
        dispatch(disconnectWebSocket()); // ✅ 연결된 경우에만 해제
      }
    };
  }, [dispatch, isConnected]);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;