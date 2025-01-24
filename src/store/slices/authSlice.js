import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    accessToken : null,
    refreshToken : null,
    username : ""
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        setTokens(state, action) {
            const { accessToken, refreshToken, username } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.username = username;
        },
        clearTokens(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.username = "";
        }
    }
})

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;