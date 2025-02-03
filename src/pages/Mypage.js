import React from "react";
import axios from "axios";
import profileImage from "./../assets/default_image.png";
import likethumb from "./../assets/likethumb.png";
import dislikethumb from "./../assets/dislikethumb.png";
import "./../styles/Mypage.css";
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";

export default function Mypage() {
    // const [profile, setProfile] = useState();
    const [nickname, setNickname] = useState();
    const [profilepic, setProfilepic] = useState();
    const [createdAt, setCreatedAt] = useState();
    const [genres, setGenres] = useState(["-"]);
    const [likeFoods, setLikeFoods] = useState(["-"]);
    const [dislikeFoods, setDislikeFoods] = useState(["-"]);
    const [dietaryPreferences, setDietaryPreferences] = useState(["-"]);
    const [spicyLevels, setSpicyLevels] = useState(["-"]);

    useEffect(() => {
        //함수
        fetchProfile();
    }, [])

    const fetchProfile = async () => {


        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("액세스 토큰 없음 - 로그인 필요");
        }
        const response = await axios.get("http://localhost:8080/api/members/profiles", {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        });
        // setProfile(response.data.data)
        setNickname(response.data.data.nickname);
        setProfilepic(response.data.data.imageUrl);
        setCreatedAt(response.data.data.createdAt);
        setGenres(response.data.data.genres);
        setLikeFoods(response.data.data.likeFoods);
        setDislikeFoods(response.data.data.dislikeFoods);
        setDietaryPreferences(response.data.data.dietaryPreferences);
        setSpicyLevels(response.data.data.spicyLevels);

    }

    return (
        <div className="container">

            {/* 메인 컨텐츠 */}
            <div className="main-content">
                <div>
                    <div className="profile-container">
                        <div className="profile-pic">
                            <img src={profilepic ? profilepic : profileImage} alt="프로필 사진" className="profile-image"></img>
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
                    <div class="taste-container">
                        <div className="taste-box">
                            <div className="taste-title">
                                <p>선호취향</p>
                                <img src={likethumb} alt="좋아요" className="likethumb"></img>
                            </div>
                            <div className="taste-tag-lists">
                                <div className="taste-tag">
                                    {dietaryPreferences.map((dietaryPreferences, index) => (<span key={index}>#{dietaryPreferences} </span>))}
                                </div>
                                <div className="taste-tag">
                                    {genres.map((genre, index) => (<span key={index}>#{genre} </span>))}
                                </div>
                                <div className="taste-tag">
                                    {likeFoods.map((likeFoods, index) => (<span key={index}>#{likeFoods} </span>))}
                                </div>
                            </div>
                            
                        </div>
                        <div className="taste-box">
                            <div className="taste-title">
                                <p>불호취향</p>
                                <img src={dislikethumb} alt="싫어요" className="dislikethumb"></img>
                            </div>
                            <div className="taste-tag">{dislikeFoods.map((dislikeFoods, index) => (<span key={index}>#{dislikeFoods} </span>))}</div>
                        </div>
                        <div className="spicyness-box">
                            <div className="taste-title">
                                <p>맵기🔥</p>
                            </div>
                            <div className="taste-tag">{spicyLevels.map((spicyLevels, index) => (<span key={index}>#{spicyLevels}단계</span>))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}