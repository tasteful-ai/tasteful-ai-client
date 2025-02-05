import React from "react";
import axios from "axios";
import profileImage from "./../assets/default_image.png";
import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./../styles/UpdateProfile.css";

export default function UpdateProfile() {

    const [nickname, setNickname] = useState();
    const [profilepic, setProfilepic] = useState();

    useEffect(() => {
        fetchLoginMember();
    }, [])

    const fetchLoginMember = async () => {

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("액세스 토큰 없음 - 로그인 필요");
        }
        const response = await axios.get("https://tastefulai.net/api/members/profiles", {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
        });


        setNickname(response.data.data.nickname);
        setProfilepic(response.data.data.imageUrl);
    }

    return (
        <div className="container">

            {/* 메인 컨텐츠 */}
            <div className="main-content">
                    <h1 style={{ marginLeft: 100 }}>프로필 설정</h1>
                    <div className="profile-pic-container">
                        <h5 className="profile-update-title">프로필 이미지 설정</h5>
                        <div className="profile-pic-update">
                            <div className="profile-pic">
                                <img src={profilepic ? profilepic : profileImage} alt="프로필 사진" className="profile-image"></img>
                            </div>
                            <div className="profile-pic-update-option">
                                <Form>
                                    <div key={`inline-radio`} className="mb-3">
                                        <Form.Check
                                            label="현재 프로필 이미지"
                                            name="group1"
                                            type='radio'
                                            id={`inline-radio-1`}
                                            defaultChecked
                                        />
                                        <Form.Check
                                            label="기본 이미지로 변경"
                                            name="group1"
                                            type='radio'
                                            id={`inline-radio-2`}
                                        />
                                        <Form.Check
                                            label="사진 불러오기"
                                            name="group1"
                                            type='radio'
                                            id={`inline-radio-2`}
                                        />
                                    </div>
                                </Form>
                                <div>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Control type="file" />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="nickname-update-container">
                        <h5 className="profile-update-title">닉네임 설정</h5>
                        <Form.Group className="nickname-input mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="email" placeholder={nickname} />
                        </Form.Group>
                    </div>
                    <div class="update-button">
                        <Button variant="dark" className="profile-update-button">변경사항 저장</Button>
                    </div>
                </div>
        </div>
    );
}