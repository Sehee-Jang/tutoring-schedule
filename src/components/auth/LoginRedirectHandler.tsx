import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getRedirectPathForUser } from "../../utils/redirectUtils";

const LoginRedirectHandler = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || isLoading) return;

    // role, email, name 등이 완전히 세팅되었는지 확인
    const isUserReady =
      !!user.role &&
      !!user.name &&
      !!user.email &&
      (user.role === "super_admin" || !!user.organizationId);
    if (!isUserReady) return;

    const targetPath = getRedirectPathForUser(user);

    // 중복 리디렉션 방지
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  return null;
};

export default LoginRedirectHandler;
