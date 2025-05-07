import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { UserRole } from "../types/user";

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== requiredRole)) {
      router.replace("/"); // 로그인 페이지로 리디렉션
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 유저가 없거나 권한이 일치하지 않을 때는 null 렌더링 (리디렉션 전까지)
  if (!user || user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
