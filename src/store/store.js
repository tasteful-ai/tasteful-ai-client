import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chattingReducer from "./slices/chattingSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chatting: chattingReducer,
    },
});

export default store;