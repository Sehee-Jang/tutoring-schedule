import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../utils/roleUtils";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className='text-center p-8'>Loading...</div>;
  }

  if (!user) {
    console.warn("🔒 AdminRoute: user is null");
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!isAdminRole(user?.role)) {
    console.warn("🚫 AdminRoute: role not allowed, redirecting to /");
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
