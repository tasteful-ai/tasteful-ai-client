import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyPassword, deleteAccount } from "../api/authApi";
import { clearTokens } from "../store/slices/authSlice";
import MyPageSidebar from "../components/MypageSidebar";
import "../styles/AccountDeletePage.css";

const AccountDeletePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  }

  const handleVerifyPassword = async () => {
    if (!password) {
      setErrorMessage("비밀번호를 입력해야 합니다.");
      return;
    }

    setIsLoading(true); // ✅ 로딩 시작
    try {
      await verifyPassword(password);
      setIsVerified(true);
      setErrorMessage("");
    } catch (err) {
      console.error("❌ 비밀번호 검증 실패:", err.response?.data);
      setErrorMessage("비밀번호가 틀렸습니다.");
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  const handleDelete = async () => {
    if (!isChecked) {
      setErrorMessage("회원 탈퇴 동의에 체크해야 합니다.");
      return;
    }

    if (!isVerified) {
      setErrorMessage("비밀번호를 먼저 확인해야 합니다.");
      return;
    }

    try {
      await deleteAccount();
      console.log("✅ 회원 탈퇴 성공");

      dispatch(clearTokens());
      localStorage.clear();
      sessionStorage.clear();

      alert("계정이 삭제되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error("❌ 회원 탈퇴 실패:", err.response?.data);
      setErrorMessage(err.response?.data?.message || "계정 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="account-delete-container">

      <MyPageSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className="account-delete-box">
        <h2 className="account-delete-title">회원 탈퇴</h2>

        {/* 🔑 비밀번호 입력 필드 */}
        <input
          type="password"
          placeholder="비밀번호 입력"
          className="account-delete-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isVerified}
        />

        {/* ✅ 새로운 비밀번호 확인 버튼 디자인 */}
        <button
          className={`verify-password-btn ${
            isVerified ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          } text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center`}
          onClick={handleVerifyPassword}
          disabled={isVerified || isLoading}
        >
          {isLoading ? (
            <div className="spinner"></div> // ✅ 로딩 애니메이션 추가
          ) : isVerified ? (
            "✔ 비밀번호 확인 완료"
          ) : (
            "비밀번호 확인"
          )}
        </button>

        {/* ❌ 오류 메시지 출력 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="warning-box">
          <p>⚠ <strong>주의</strong></p>
          <ul>
            <li>탈퇴한 아이디로는 다시 회원가입할 수 없습니다.</li>
            <li>탈퇴 처리 후에는 데이터를 복구할 수 없습니다.</li>
          </ul>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              if (e.target.checked) setErrorMessage("");
            }}
          />
          <span>해당 내용을 모두 확인하였으며, 회원 탈퇴에 동의합니다.</span>
        </div>

        <button
          className="account-delete-btn"
          onClick={handleDelete}
          disabled={!isChecked || !isVerified}
        >
          회원 탈퇴 신청
        </button>
      </div>
    </div>
  );
};

export default AccountDeletePage;
