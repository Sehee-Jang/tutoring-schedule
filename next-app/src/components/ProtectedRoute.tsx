import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!user || user.role !== requiredRole) {
    return <Link href='/' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
