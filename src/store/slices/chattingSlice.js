import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";

// 웹소켓 연결 설정
const socket = io("http://localhost:8080/ws-chat",{extraHeaders: {Authorization: 'Bearer '}});

// 비동기 액션: 채팅방 목록 가져오기
export const fetchChattingRooms = createAsyncThunk(
  "chatting/fetchChattingRooms",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/chatting/room/1`,{headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VydGVzdDEyM0BnbWFpbC5jb20iLCJpYXQiOjE3Mzc5NjAxMDAsImV4cCI6MTczNzk2MzcwMH0.VhW9YNZRdT39K83GRI9nHYutQ7A--koyew1H2UDhkLE'}});
      return response.data.data; // 서버에서 받은 채팅방 목록
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "채팅방 목록을 불러오는 중 에러 발생");
    }
  }
);

// 비동기 액션: 특정 채팅방 메시지 가져오기
export const fetchRoomMessages = createAsyncThunk(
  "chatting/fetchRoomMessages",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chatting/room/${roomId}/messages`);
      return response.data.data; // 서버에서 받은 메시지 목록
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "메시지를 불러오는 중 에러 발생");
    }
  }
);

// 채팅 슬라이스 정의
const chattingSlice = createSlice({
  name: "chatting",
  initialState: {
    rooms: [], // 채팅방 목록
    messages: [], // 특정 채팅방 메시지
    loading: false,
    error: null,
  },
  reducers: {
    // 메시지 추가
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 채팅방 목록 가져오기
      .addCase(fetchChattingRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChattingRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChattingRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 특정 채팅방 메시지 가져오기
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchRoomMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 액션 생성 함수
export const { addMessage } = chattingSlice.actions;

// 웹소켓 연결 액션
export const connectWebSocket = () => (dispatch) => {
  socket.on("connect", () => {
    console.log("WebSocket 연결됨");
  });

  // 서버로부터 메시지를 받을 때
  socket.on("message", (message) => {
    dispatch(addMessage(message)); // 메시지를 상태에 추가
  });
};

// 웹소켓 연결 해제 액션
export const disconnectWebSocket = () => () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("WebSocket 연결 해제됨");
  }
};

// 메시지 전송 액션
export const sendMessage = (message) => () => {
  socket.emit("message", message);
};

// 채팅 슬라이스 리듀서
export default chattingSlice.reducer;
