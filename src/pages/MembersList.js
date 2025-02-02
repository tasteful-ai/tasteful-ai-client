import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import "../styles/MembersList.css";
import { clearTokens } from "../store/slices/authSlice";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ 회원 목록 불러오기
  const fetchMembers = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/auth/members", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      setMembers(
        response.data.data.map((member) => ({
          memberId: member.id ?? member.memberId,
          nickname: member.nickname,
          email: member.email,
          gender: member.gender,
          role: member.role,
          deletedAt: member.deletedAt,
          createdAt: member.createdAt,
        }))
      );
    } catch (err) {
      console.error("❌ 회원 목록 불러오기 실패:", err.response || err);
      setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, location.pathname]);

  // ✅ 회원 삭제 기능
  const handleDeleteMember = async (memberId, role, isDeleted) => {
    if (role === "ADMIN") {
      alert("🚫 관리자 계정은 보호되어 있습니다.");
      return;
    }

    if (isDeleted) {
      alert("⛔ 이미 접근 제한된 회원입니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 이 회원을 접근 제한하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:8080/api/admins/members/${memberId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      alert("회원이 성공적으로 접근 제한되었습니다.");
      fetchMembers();
    } catch (err) {
      console.error("❌ 삭제 실패:", err.response || err);

      if (err.response?.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(clearTokens());
        navigate("/login");
      } else {
        alert(`회원 삭제 중 오류가 발생했습니다. (${err.response?.status})`);
      }
    }
  };

  if (loading) return <p className="loading-text">로딩 중...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="admin-main-container">      
      <div className="admin-content">
        <h2 className="admin-title">회원 목록</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>회원 ID</th>
              <th>가입일</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>성별</th>
              <th>권한</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.memberId}>
                  <td>{member.memberId}</td>
                  <td>{member.createdAt}</td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>{member.gender}</td>
                  <td>{member.role}</td>
                  <td>
                    <div className={`status-text ${member.deletedAt ? "inactive" : "active"}`}>
                      {member.deletedAt ? "⛔ 비활성화" : "✅ 활성화"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDeleteMember(member.memberId, member.role, member.deletedAt)}
                      disabled={member.role === "ADMIN" || member.deletedAt}
                      style={{
                        backgroundColor: member.role === "ADMIN" ? "#3498db" : member.deletedAt ? "#aaa" : "black",
                        cursor: member.role === "ADMIN" || member.deletedAt ? "not-allowed" : "pointer",
                      }}
                    >
                      {member.role === "ADMIN" ? "🔒 보호됨" : member.deletedAt ? "⛔ 접근 제한됨" : "🚫 접근 제한"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-members">회원이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;
