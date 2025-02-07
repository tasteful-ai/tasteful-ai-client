import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL, //백엔드 엔드포인트 기본 url
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("🚨 401 Unauthorized - 로그인 필요!");
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; 
      }
      return Promise.reject(error);
    }
  );


export default api;