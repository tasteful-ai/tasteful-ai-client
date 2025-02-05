import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";
import SockJs from "sockjs-client";
import axios from "../../api/api";

let stompClient = null;  

const initialState = {
  connected: false, 
  messages: [],
  rooms: [],
  loading: false,
  error: null,
};

export const fetchChattingRooms = createAsyncThunk(
  "chatting/fetchChattingRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chatting/rooms");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "채팅방 목록 불러오기 실패");
    }
  }
);

export const fetchRoomMessages = createAsyncThunk(
  "chatting/fetchRoomMessages",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chatting/rooms/${roomId}/messages`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "메시지 불러오기 실패");
    }
  }
);

const chattingSlice = createSlice({
  name: "chatting",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
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

export const connectWebSocket = (roomId) => (dispatch) => {
  if (stompClient) return; 

  const token = localStorage.getItem("accessToken");
  const sender = localStorage.getItem("nickname");

  stompClient = new Client({
    webSocketFactory: () => new SockJs("https://tasteful-ai-1520107369.ap-northeast-2.elb.amazonaws.com/ws-chat"),
    connectHeaders: {
      Authorization: token,
    },
    onConnect: () => {
      console.log("✅ WebSocket Connected!");

      stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        dispatch(addMessage({ sender: data.senderNickname || sender, message: data.message }));
      });

      dispatch(setConnected(true));
    },
    onStompError: (frame) => {
      console.error("🚨 WebSocket Error: ", frame);
    },
    onDisconnect: () => {
      console.log("❌ WebSocket Disconnected");
      dispatch(setConnected(false));
      stompClient = null;
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => (dispatch) => {
  if (stompClient) {
    stompClient.deactivate();
    dispatch(setConnected(false));
    stompClient = null;
  }
};

export const sendMessage = (roomId, message) => (dispatch) => {
  const token = localStorage.getItem("accessToken");
  const sender = localStorage.getItem("nickname");

  if (!stompClient || !stompClient.connected) {
    console.error("🚨 WebSocket이 연결되지 않았습니다.");
    return;
  }

  console.log("📩 메시지 전송:", { roomId, sender, message });

  stompClient.publish({
    destination: `/pub/chat`,
    body: JSON.stringify({
      chattingroomId: roomId,
      sender: sender,
      message: message,
      token: token,
      type: "TALK",
    }),
  });

  // ✅ 전송한 메시지를 Redux 상태에 추가
  dispatch(addMessage({ sender: sender, message: message }));
};

export const { setConnected, addMessage } = chattingSlice.actions;
export default chattingSlice.reducer;
