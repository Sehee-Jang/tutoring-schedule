import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // 로그인 안했으면 로그인 페이지로 보내기 (예시로 / 사용)
    return <Navigate to='/' replace />;
  }

  if (user.role !== "admin") {
    // 관리자가 아니면 홈으로 리다이렉트
    return <Navigate to='/' replace />;
  }

  // 관리자는 접근 허용
  return <>{children}</>;
};

export default AdminRoute;
