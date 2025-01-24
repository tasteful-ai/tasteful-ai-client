import React, { useState } from "react"
import { useDispatch } from "react-redux";
import axios from 'axios';
import { setTokens } from "../store/slices/authSlice";
import axiosInstance from "../api/api";

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const hanlderSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axiosInstance.post('/api/login', {
                username : username,
                password : password
            })

            const { accessToken, refreshToken } = response.data;
    
            dispatch(setTokens(
                {
                    accessToken,
                    refreshToken,
                    username
                }
            ))
    
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            alert('로그인 성공!')
        } catch (e) {
            alert('로그인 실패!')
        }
    }
    
    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={hanlderSubmit}>
                <div>
                    <label>아이디: </label>
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>비밀번호: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}