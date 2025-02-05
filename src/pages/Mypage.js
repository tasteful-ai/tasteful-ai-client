import React, { useEffect, useState } from "react";
import axios from "axios";
import profileImage from "./../assets/default_image.png";
import likethumb from "./../assets/likethumb.png";
import dislikethumb from "./../assets/dislikethumb.png";
import "./../styles/Mypage.css";
import Button from "react-bootstrap/Button";

export default function Mypage() {
    const [nickname, setNickname] = useState("");
    const [profilepic, setProfilepic] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [genres, setGenres] = useState([]);
    const [likeFoods, setLikeFoods] = useState([]);
    const [dislikeFoods, setDislikeFoods] = useState([]);
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    const [spicyLevels, setSpicyLevels] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("액세스 토큰 없음 - 로그인 필요");
            }
            const response = await axios.get("https://tasteful-ai-1520107369.ap-northeast-2.elb.amazonaws.com/api/members/profiles", {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });

            const data = response.data.data;
            setNickname(data.nickname || "익명");
            setProfilepic(data.imageUrl || profileImage);
            setCreatedAt(data.createdAt || "가입일 정보 없음");
            setGenres(data.genres || []);
            setLikeFoods(data.likeFoods || []);
            setDislikeFoods(data.dislikeFoods || []);
            setDietaryPreferences(data.dietaryPreferences || []);
            setSpicyLevels(data.spicyLevels || []);
        } catch (error) {
            console.error("프로필 불러오기 실패:", error);
        }
    };

    return (
        <div className="container">
            <div className="main-content">
                <div>
                    {/* 프로필 정보 */}
                    <div className="profile-container">
                        <div className="profile-pic">
                            <img src={profilepic} alt="프로필 사진" className="profile-image" />
                        </div>
                        <div className="profile-info">
                            <h1 className="nickname">{nickname}</h1>
                            <h4 className="created-at">가입일: {createdAt}</h4>
                            <div className="profile-buttons">
                                <Button variant="dark" className="profile-update-button">프로필 설정</Button>
                                <Button variant="secondary" className="taste-update-button">취향 바꾸기</Button>
                            </div>
                        </div>
                    </div>

                    {/* 취향 정보 */}
                    <div className="taste-container">
                        <div className="taste-box">
                            <div className="taste-title">
                                <p>선호취향</p>
                                <img src={likethumb} alt="좋아요" className="likethumb" />
                            </div>
                            <div className="taste-tag-lists">
                                <div className="taste-tag">
                                    {dietaryPreferences?.map((diet, index) => (
                                        <span key={index}>#{diet} </span>
                                    ))}
                                </div>
                                <div className="taste-tag">
                                    {genres?.map((genre, index) => (
                                        <span key={index}>#{genre} </span>
                                    ))}
                                </div>
                                <div className="taste-tag">
                                    {likeFoods?.map((food, index) => (
                                        <span key={index}>#{food} </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="taste-box">
                            <div className="taste-title">
                                <p>불호취향</p>
                                <img src={dislikethumb} alt="싫어요" className="dislikethumb" />
                            </div>
                            <div className="taste-tag">
                                {dislikeFoods?.map((food, index) => (
                                    <span key={index}>#{food} </span>
                                ))}
                            </div>
                        </div>

                        <div className="spicyness-box">
                            <div className="taste-title">
                                <p>맵기🔥</p>
                            </div>
                            <div className="taste-tag">
                                {spicyLevels?.map((level, index) => (
                                    <span key={index}>#{level}단계</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
