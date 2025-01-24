import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', //백엔드 엔드포인트 기본 url
})

axiosInstance.interceptors.request.use(
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

export default axiosInstance;