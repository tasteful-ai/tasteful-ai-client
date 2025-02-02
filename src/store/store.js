import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chattingReducer from "./slices/chattingSlice"
import tasteReducer from "./slices/tasteSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chatting: chattingReducer,
        taste: tasteReducer,
    },
});

export default store;