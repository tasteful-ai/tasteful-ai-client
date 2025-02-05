import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8080/api/aiChats";

export const sendChatMessage = async (message) => {
  try {
    const token = localStorage.getItem("accessToken"); // ✅ JWT 토큰 가져오기

    const headers = token
      ? { Authorization: `Bearer ${token}` } // ✅ 토큰이 있으면 Authorization 헤더 추가
      : {};

    console.log("📤 AI 요청:", message);

    const response = await axios.post(
      API_URL,
      { message },
      { headers } // ✅ 헤더 포함하여 요청
    );

    console.log("📥 AI 응답:", response.data);
    return response.data.data.recommendation;
  } catch (error) {
    console.error("❌ AI 응답 실패:", error);
    return "추천을 가져올 수 없습니다.";
  }
};
