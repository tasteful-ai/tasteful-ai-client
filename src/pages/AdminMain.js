import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTokens } from "../store/slices/authSlice";

const AdminMain = () => {
  const dispatch = useDispatch();
  const memberRole = useSelector((state) => state.auth.memberRole) || localStorage.getItem("memberRole");

  useEffect(() => {
    // ✅ localStorage에서 Redux로 memberRole 업데이트
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const memberRole = localStorage.getItem("memberRole");
    const memberId = localStorage.getItem("memberId");


    if (accessToken && memberRole) {
      dispatch(setTokens({ accessToken, refreshToken, memberRole, memberId }));
    }
  }, [dispatch]);

  console.log("🔍 AdminMain Redux memberRole:", memberRole);

  return (
    <div>
      {memberRole === "ADMIN" ? <h1>관리자 페이지</h1> : <h1>접근 권한이 없습니다.</h1>}
    </div>
  );
};

export default AdminMain;
