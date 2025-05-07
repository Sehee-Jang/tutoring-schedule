import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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
    return <Link href='/' replace />;
  }

  if (!user) {
    return <Link href='/' replace />;
  }

  if (user.role !== "admin") {
    return <Link href='/' replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
