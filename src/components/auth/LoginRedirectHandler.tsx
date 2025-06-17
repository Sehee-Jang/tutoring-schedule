import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRedirectPathForUser } from "../../utils/redirectUtils";

const LoginRedirectHandler = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || isLoading) return;

    // role, email, name 등이 완전히 세팅되었는지 확인
    const isUserReady =
      !!user.role &&
      !!user.name &&
      !!user.email &&
      (user.role === "super_admin" ||
        user.organizationId ||
        user.role === "tutor");

    if (!isUserReady) return;

    const targetPath = getRedirectPathForUser(user);
    navigate(targetPath, { replace: true });
  }, [user, isLoading, navigate]);

  return null;
};

export default LoginRedirectHandler;
