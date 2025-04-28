import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className='text-center p-8'>Loading...</div>;
  }

  if (!user) {
    // 로그인 안했으면 로그인 페이지로 보내기 (예시로 / 사용)
    return <Navigate to='/' replace />;
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
