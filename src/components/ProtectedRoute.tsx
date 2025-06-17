import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { UserRole } from "../types/user";
import { isSuperAdmin } from "../utils/roleUtils";

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

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user.role === "tutor" && user.status === "pending") {
    return <Navigate to='/pending-approval' replace />;
  }

  if (user.status === "pending" && !isSuperAdmin(user.role)) {
    return <Navigate to='/pending-approval' replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
