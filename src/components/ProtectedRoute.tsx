import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { UserRole } from "../types/user";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
