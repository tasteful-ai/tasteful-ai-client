import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Main from "./pages/Main";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";

function Layout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/signup" && location.pathname !== "/login"; // 회원가입/로그인 페이지에서는 사이드바 숨김

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />} {/* 조건부로 사이드바 렌더링 */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
