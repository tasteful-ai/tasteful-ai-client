import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/api";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  memberRole: localStorage.getItem("memberRole") || null,
  memberId: localStorage.getItem("memberId") || null,
  status: "idle",
  error: null,
};

// ✅ 로그인 액션
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post("/api/auth/login", credentials);
    console.log("🔍 Login API Response:", response.data.data);

    const { accessToken, refreshToken, memberRole, memberId } = response.data.data;

    // ✅ Redux 상태 업데이트
    thunkAPI.dispatch(setTokens({ accessToken, refreshToken, memberRole, memberId }));

    // ✅ LocalStorage 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("memberRole", memberRole);
    localStorage.setItem("memberId", memberId);

    return { accessToken, refreshToken, memberRole, memberId };
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || "로그인 실패");
  }
});

// ✅ Redux Slice 생성
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action) {
      const { accessToken, refreshToken, memberRole, memberId } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.memberRole = memberRole;
      state.memberId = memberId;
    },

    clearTokens(state) {
      console.log("🚀 모든 인증 정보 삭제");
      state.accessToken = null;
      state.refreshToken = null;
      state.memberRole = null;
      state.memberId = null;
      localStorage.clear();
      sessionStorage.clear();
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
