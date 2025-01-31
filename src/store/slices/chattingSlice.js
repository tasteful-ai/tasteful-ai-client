import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";
import axios from "../../api/api";

const initialState = {
  client: null,
  connected: false,
  messages: [],
  rooms: [],
  loading: false,
  error: null,
};

// 채팅방 목록 가져오기 (백엔드 `/api/chatting/rooms`)
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

// 특정 채팅방 메시지 가져오기 (백엔드 `/api/chatting/room/{roomId}/messages`)
export const fetchRoomMessages = createAsyncThunk(
  "chatting/fetchRoomMessages",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chatting/room/${roomId}/messages`);
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
    setClient: (state, action) => {
      state.client = action.payload;
    },
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

// WebSocket 연결
export const connectWebSocket = (roomId) => (dispatch, getState) => {
  const { client, connected } = getState().chatting;
  if (connected) return;

  const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws-chat",
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    onConnect: () => {
      dispatch(setConnected(true));
      stompClient.subscribe(`/topic/chatting/room/${roomId}`, (message) => {
        dispatch(addMessage(JSON.parse(message.body)));
      });
    },
    onDisconnect: () => {
      dispatch(setConnected(false));
    },
  });

  stompClient.activate();
  dispatch(setClient(stompClient));
};

// WebSocket 연결 해제
export const disconnectWebSocket = () => (dispatch, getState) => {
  const { client } = getState().chatting;
  if (client) {
    client.deactivate();
    dispatch(setConnected(false));
  }
};

// 메시지 전송
export const sendMessage = (roomId, message) => (dispatch, getState) => {
  const { client, connected } = getState().chatting;
  if (client && connected) {
    client.publish({
      destination: `/app/chatting/room/${roomId}/message`,
      body: JSON.stringify({ roomId, sender: localStorage.getItem("username"), message }),
    });
  }
};

export const { setClient, setConnected, addMessage } = chattingSlice.actions;
export default chattingSlice.reducer;
