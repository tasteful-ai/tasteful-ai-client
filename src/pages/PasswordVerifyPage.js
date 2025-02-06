import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassword } from "../api/authApi"; // ✅ API 호출
import Input from "../components/Input"; 
import Button from "../components/Button"; 

const PasswordVerifyPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await verifyPassword(password);
      navigate("/account/delete"); // ✅ 검증 성공 시 계정 삭제 페이지로 이동
    } catch (err) {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">비밀번호 확인</h2>
      <Input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleVerify}>확인</Button>
    </div>
  );
};

export default PasswordVerifyPage;
