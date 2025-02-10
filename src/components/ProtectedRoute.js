import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem("memberRole");

  if (userRole !== "ADMIN") {
    alert("🚫 관리자 전용 페이지입니다.");
    return <Navigate to="/" replace />; // 관리자 아니면 홈으로 이동
  }

  return children;
};

export default ProtectedRoute;
