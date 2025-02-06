import axiosInstance from "./api"; // ✅ 현재 폴더(`./`) 안에서 가져오기

// 비밀번호 검증 API
export const verifyPassword = (password) => {
  return axiosInstance.post("/api/members/password/check", { password });
};

// 계정 삭제 API
export const deleteAccount = () => {
  return axiosInstance.delete("/api/members/delete");
};
