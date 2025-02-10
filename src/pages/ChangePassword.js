import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(""); // ✅ 모달 메시지
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  const handleClose = () => setShowModal(false); // 모달 닫기
  const handleShow = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      handleShow("🚫 새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.patch(
        process.env.REACT_APP_SERVER_URL + "/api/members/password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      handleShow("✅ 비밀번호가 성공적으로 변경되었습니다!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      handleShow("❌ 비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="password-change-container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleChangePassword}>
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

        <button type="submit">비밀번호 변경</button>
      </form>

      {/* ✅ 모달 컴포넌트 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChangePassword;
