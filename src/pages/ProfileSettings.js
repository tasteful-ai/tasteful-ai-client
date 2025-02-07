import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/ProfileSettings.css";
import profileImage from "./../assets/default_image.png";

export default function ProfileSettings() {
    const [nickname, setNickname] = useState("");
    const [profileOption, setProfileOption] = useState("current");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(profileImage);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ 파일 선택 핸들러 (미리보기 포함)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); // ✅ 선택한 이미지 미리보기
        }
    };

    // ✅ 변경사항 저장 (닉네임 + 프로필 이미지)
    const handleSaveChanges = async () => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }
            
            // ✅ 닉네임 변경 요청
            if (nickname) {
                await axios.patch(
                    `${process.env.REACT_APP_SERVER_URL}/api/members/profiles/nickname`,
                    { nickname },
                    {
                        headers: { Authorization: `Bearer ${accessToken}` }, // 🔥 수정된 부분
                        withCredentials: true,
                    }
                );
            }

            // ✅ 프로필 이미지 변경 요청
            if (profileOption === "default") {
                // 기본 이미지로 변경 요청 (DELETE)
                await axios.delete(
                    `${process.env.REACT_APP_SERVER_URL}/api/members/profiles/images`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` }, // 🔥 수정된 부분
                        withCredentials: true,
                    }
                );
            } else if (selectedFile) {
                // 새 이미지 업로드 요청 (PUT)
                const formData = new FormData();
                formData.append("image", selectedFile);

                await axios.put(
                    `${process.env.REACT_APP_SERVER_URL}/api/members/profiles/images`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // 🔥 수정된 부분
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );
            }

            alert("프로필 변경이 저장되었습니다!"); // ✅ 성공 메시지
            navigate("/mypage"); // ✅ 저장 후 마이페이지 이동
        } catch (error) {
            console.error("프로필 변경 실패:", error);
            alert("프로필 변경 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">프로필 설정</h2>

            <div className="profile-image-section">
                <img src={previewImage} alt="프로필" className="profile-preview" />
                <div className="profile-options">
                    <label>
                        <input
                            type="radio"
                            value="current"
                            checked={profileOption === "current"}
                            onChange={() => {
                                setProfileOption("current");
                                setPreviewImage(profileImage);
                                setSelectedFile(null);
                            }}
                        />
                        기본 이미지로 변경
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="upload"
                            checked={profileOption === "upload"}
                            onChange={() => setProfileOption("upload")}
                        />
                        사진 불러오기 (jpg, png)
                    </label>
                    {profileOption === "upload" && (
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    )}
                </div>
            </div>

            <div className="nickname-section">
                <label>닉네임 설정</label>
                <input
                    type="text"
                    placeholder="새로운 닉네임 입력"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
            </div>

            <button className="save-button" onClick={handleSaveChanges} disabled={loading}>
                {loading ? "저장 중..." : "변경사항 저장"}
            </button>
        </div>
    );
}
