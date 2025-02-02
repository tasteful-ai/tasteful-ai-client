import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchMembers();
  }, [location.pathname]);

  // ✅ 회원 목록 불러오기 (memberId 포함)
  const fetchMembers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      console.log("🔹 현재 토큰:", accessToken);
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/auth/members", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      console.log("🔹 응답 데이터:", response.data.data);

      // ✅ 백엔드에서 `id` 또는 `memberId` 필드를 정확하게 설정
      setMembers(response.data.data.map(member => ({
        id: member.id ?? member.memberId,  // `id`가 없으면 `memberId` 사용
        memberId: member.memberId,         // ✅ 삭제 시 사용할 memberId
        nickname: member.nickname,
        email: member.email,
        gender: member.gender,
        role: member.role,
        deletedAt: member.deletedAt,
        createdAt: member.createdAt
      })));

    } catch (err) {
      console.error("❌ 회원 목록 불러오기 실패:", err.response || err);
      setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const refreshTokenAndRetry = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("❌ 리프레시 토큰 없음 - 재로그인 필요");

    const refreshResponse = await axios.post("http://localhost:8080/api/auth/refresh", {
      refreshToken,
    });

    const newAccessToken = refreshResponse.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);

    return fetchMembers();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearTokens());
    navigate("/login");
  };

  // ✅ 회원 삭제 기능 (ID 확인 및 API URL 수정)
  const handleDeleteMember = async (memberId) => {
    console.log("🔹 삭제 요청 대상 멤버 ID:", memberId); // ✅ 삭제 요청 전에 ID 확인

    if (!memberId) {
      alert("삭제할 회원의 ID가 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 이 회원을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      console.log("🔹 현재 토큰: ", accessToken);
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(`http://localhost:8080/api/admins/members/${memberId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      console.log("✅ 삭제 성공: ", response);
      alert("회원이 성공적으로 삭제되었습니다.");
      fetchMembers();
    } catch (err) {
      console.error("❌ 삭제 실패:", err.response || err);

      if (err.response?.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
                  <td>{member.createdAt}</td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>{member.gender}</td>
                  <td>{member.role}</td>
                  <td>
                    <div className={`status-text ${member.deletedAt ? "inactive" : "active"}`}>
                      {member.deletedAt ? "비활성화" : "활성화"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => {
                        console.log("🛠 버튼 클릭 - 삭제할 ID:", member.memberId); // ✅ 로그 추가
                        handleDeleteMember(member.memberId);
                      }}
                    >
                      회원 추방
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-members">회원이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;
