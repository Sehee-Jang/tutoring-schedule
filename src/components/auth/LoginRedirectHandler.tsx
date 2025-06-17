import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRedirectPathForUser } from "../../utils/redirectUtils";

const LoginRedirectHandler = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || isLoading) return;

    // pending 상태인 튜터는 승인 대기 페이지로 이동
    if (user.role === "tutor" && user.status === "pending") {
      navigate("/pending-approval", { replace: true });
      return;
    }

    const targetPath = getRedirectPathForUser(user);
    navigate(targetPath, { replace: true });
  }, [user, isLoading, navigate]);

  return null;
};

export default LoginRedirectHandler;
