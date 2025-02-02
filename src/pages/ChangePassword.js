import { useState } from "react";
import axios from "axios";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("🚫 새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.patch(
        "http://localhost:8080/api/auth/passwords", // ✅ PATCH 메서드 확인
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setMessage("✅ 비밀번호가 성공적으로 변경되었습니다!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("❌ 비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="password-change-container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleChangePassword}>
        {/* ✅ 입력 필드를 가로 정렬하는 컨테이너 적용 */}
        <div className="password-field">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력해주세요"
            required
          />
        </div>

        <div className="password-field">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요"
            required
          />
        </div>

        <div className="password-field">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 다시 입력해주세요"
            required
          />
        </div>

        {message && <p className="message">{message}</p>}

        <button type="submit">비밀번호 변경</button>
      </form>
    </div>
  );
};

export default ChangePassword;
