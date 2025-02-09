import axios from "axios";

const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/aiChats`;

export const sendChatMessage = async (message) => {
  try {
    const token = localStorage.getItem("accessToken");

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    console.log("📤 AI 요청:", message);

    const response = await axios.post(
      API_URL,
      { message },
      { headers }
    );

    console.log("📥 AI 응답:", response.data);
    return {
      recommendation: response.data.data.recommendation,
      description: response.data.data.description,
    };
  } catch (error) {
    console.error("❌ AI 응답 실패:", error);

    if (error.response && error.response.status === 429) {

      return {
        recommendation: "추천은 하루에 10번까지 받을 수 있어요! 내일 더 맛있는 메뉴 추천해줄게요! 🍽️",
        description: "",
      };
    }

    return {
      recommendation: "현재 추천을 제공할 수 없습니다. 나중에 다시 시도해주세요.",
      description: "",
    };
  }
};