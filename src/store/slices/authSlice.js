import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/api";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  memberRole: localStorage.getItem("memberRole") || "", // ✅ userRole → memberRole로 변경
  memberId: localStorage.getItem("memberId") || null,
  status: "idle",
  error: null,
};

// ✅ 로그인 액션 (JWT 디코딩 추가)
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post("/api/auth/login", credentials);
    console.log("🔍 Login API Response:", response.data.data);

    const { accessToken, refreshToken, memberRole, memberId } = response.data.data;

    // ✅ LocalStorage 저장
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("refreshToken", refreshToken);
    window.localStorage.setItem("memberRole", memberRole);
    window.localStorage.setItem("memberId", memberId);

    console.log(localStorage.getItem("memberRole"));

    return { accessToken, refreshToken, memberRole, memberId };
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response.data);
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


      // ✅ LocalStorage 저장
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("refreshToken", refreshToken);
      window.localStorage.setItem("memberRole", memberRole);
      window.localStorage.setItem("memberId", memberId);

    },

    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.memberRole = "";
      state.memberId = null;


      // ✅ LocalStorage 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("memberRole");
      localStorage.removeItem("memberId");

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, refreshToken, memberRole, memberId } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.memberRole = memberRole;
        state.memberId = memberId;
      })
      .addCase(login.rejected, (state, action) => {
        console.error("❌ Redux Login Rejected:", action.payload);
      });
  },
});

// ✅ Export 추가
export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
