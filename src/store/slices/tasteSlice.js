import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/api";

export const fetchTasteCategories = createAsyncThunk(
    "taste/fetchTasteCategories",
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState();
        const memberId = state.user?.userInfo?.memberId || localStorage.getItem("memberId");
  
        if (!memberId) {
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }
  
        const response = await axios.get(`/api/members/${memberId}/tastes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 👈 JWT 토큰 추가
          },
        });
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "취향 데이터를 불러오지 못했습니다.");
      }
    }
  );

  export const updateTasteCategory = createAsyncThunk(
    "taste/updateTasteCategory",
    async ({ category, data }, { rejectWithValue }) => {
      try {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) throw new Error("사용자 ID를 찾을 수 없습니다.");
  
        let endpoint = "";
        switch (category) {
          case "genres":
            endpoint = `/api/members/${memberId}/tastes/genres`;
            break;
          case "likeFoods":
            endpoint = `/api/members/${memberId}/tastes/likeFoods`;
            break;
          case "dislikeFoods":
            endpoint = `/api/members/${memberId}/tastes/dislikeFoods`;
            break;
          case "dietaryPreferences":
            endpoint = `/api/members/${memberId}/tastes/dietaryPreferences`;
            break;
          case "spicyLevel":
            endpoint = `/api/members/${memberId}/tastes/spicyLevel`;
            break;
          default:
            throw new Error("잘못된 카테고리 요청입니다.");
        }
  
        const response = await axios.patch(endpoint, data);
        return { category, data: response.data.data };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "취향 데이터를 저장할 수 없습니다.");
      }
    }
  );

const initialState = {
    genres: [], 
    likeFoods: [], 
    dislikeFoods: [], 
    dietaryPreferences: [], 
    spicyLevel: null, 
    loading: false,
    error: null,
  };

const tasteSlice = createSlice({
  name: "taste",
  initialState,
  reducers: {
    setTasteCategories: (state, action) => {
      state.genres = action.payload.genres || [];
      state.likeFoods = action.payload.likeFoods || [];
      state.dislikeFoods = action.payload.dislikeFoods || [];
      state.dietaryPreferences = action.payload.dietaryPreferences || [];
      state.spicyLevel = action.payload.spicyLevel || null;
    },

    updateTasteCategories: (state, action) => {
        if (action.payload.type === "genres") {
          state.genres = action.payload.data;
        } else if (action.payload.type === "likeFoods") {
          state.likeFoods = action.payload.data;
        } else if (action.payload.type === "dislikeFoods") {
          state.dislikeFoods = action.payload.data;
        } else if (action.payload.type === "dietaryPreferences") {
          state.dietaryPreferences = action.payload.data;
        } else if (action.payload.type === "spicyLevel") {
          state.spicyLevel = action.payload.data;
        }
      }

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasteCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasteCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload.genres || [];
        state.likeFoods = action.payload.likeFoods || [];
        state.dislikeFoods = action.payload.dislikeFoods || [];
        state.dietaryPreferences = action.payload.dietaryPreferences || [];
        state.spicyLevel = action.payload.spicyLevel || null;
      })
      .addCase(fetchTasteCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(updateTasteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTasteCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.category === "genres") {
          state.genres = action.payload.data;
        } else if (action.payload.category === "likeFoods") {
          state.likeFoods = action.payload.data;
        } else if (action.payload.category === "dislikeFoods") {
          state.dislikeFoods = action.payload.data;
        } else if (action.payload.category === "dietaryPreferences") {
          state.dietaryPreferences = action.payload.data;
        } else if (action.payload.category === "spicyLevel") {
          state.spicyLevel = action.payload.data;
        }
      })
      .addCase(updateTasteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTasteCategories} = tasteSlice.actions;
export default tasteSlice.reducer;
