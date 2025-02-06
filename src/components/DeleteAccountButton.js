import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../api/authApi";

const DeleteAccountButton = () => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm("정말 탈퇴하시겠습니까?")) {
            try {
                await deleteAccount();
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.removeItem("accessToken");  // 로그아웃 처리
                navigate("/");  // 홈 화면으로 이동
            } catch (error) {
                alert("회원 탈퇴에 실패했습니다.");
            }
        }
    };

    return (
        <button onClick={handleDelete} style={{ color: "red", cursor: "pointer" }}>
            회원 탈퇴
        </button>
    );
};

export default DeleteAccountButton;
