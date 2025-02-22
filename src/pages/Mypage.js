import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileImage from "./../assets/default_image.png";
import "./../styles/Mypage.css";
import Button from "react-bootstrap/Button";

export default function Mypage() {
    const [profileData, setProfileData] = useState({
        nickname: "익명",
        profilepic: profileImage,
        createdAt: "가입일 정보 없음",
        genres: [],
        likeFoods: [],
        dislikeFoods: [],
        dietaryPreferences: [],
        spicyLevels: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ✅ API 요청 최적화
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }
            const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/api/members/profiles", {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            const data = response?.data?.data || {};
            setProfileData({
                nickname: data.nickname || "익명",
                profilepic: data.imageUrl || profileImage,
                createdAt: data.createdAt || "가입일 정보 없음",
                genres: data.genres || [],
                likeFoods: data.likeFoods || [],
                dislikeFoods: data.dislikeFoods || [],
                dietaryPreferences: data.dietaryPreferences || [],
                spicyLevels: data.spicyLevels || [],
            });
        } catch (error) {
            console.error("프로필 불러오기 실패:", error);
            setError("프로필 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <div className="settings-container">
            <h2 className="settings-title">마이페이지</h2>

            {loading ? (
                <p className="loading-message">불러오는 중...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    {/* ✅ 프로필 카드 */}
                    <div className="profile-image-section">
                        <img src={profileData.profilepic} alt="프로필 사진" className="profile-preview" />
                        <div className="profile-info">
                            <h1 className="nickname">{profileData.nickname}</h1>
                            <h4 className="created-at">가입일: {profileData.createdAt}</h4>
                        </div>
                        <div className="profile-buttons">
                            <Button className="save-button" onClick={() => navigate("/profile-settings")}>
                                프로필 설정
                            </Button>
                            <Button className="save-button" onClick={() => navigate("/taste-selection")}>
                                취향 수정
                            </Button>
                        </div>
                    </div>

                    {/* ✅ 취향 태그 섹션 */}
                    <div className="taste-container">
                        {/* ✅ 맵기 취향 (가로 긴 박스, 상단) */}
                        <div className="spicyness-box">
                            <div className="spicy-container">
                                <p className="spicy-level">맵기 🔥</p>
                            </div>
                            <div className="taste-tag-lists">
                                {profileData.spicyLevels.map((level, index) => (
                                    <span key={index} className="taste-tag">#{level}단계</span>
                                ))}
                            </div>
                        </div>

                        {/* ✅ 선호취향 & 불호취향 (2열 배치) */}
                        <div className="taste-grid">
                            <div className="taste-box">
                                <div className="taste-title">
                                    <p>선호 취향 👍 </p>
                                </div>
                                <div className="taste-tag-lists">
                                    {[...profileData.dietaryPreferences, ...profileData.genres, ...profileData.likeFoods].map((item, index) => (
                                        <span key={index} className="taste-tag">#{item}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="taste-box">
                                <div className="taste-title">
                                    <p>불호 취향 👎 </p>
                                </div>
                                <div className="taste-tag-lists">
                                    {profileData.dislikeFoods.map((food, index) => (
                                        <span key={index} className="taste-tag">#{food}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>



                </>
            )}
        </div>
    );
}