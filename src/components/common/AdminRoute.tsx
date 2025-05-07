import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩 중일 때는 아무것도 렌더링하지 않음
    if (isLoading) return;

    // 로그인하지 않았거나, 관리자가 아니면 메인 페이지로 리다이렉트
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // 로딩 중일 때는 로딩 메시지
  if (isLoading) {
    return <div className='text-center p-8'>Loading...</div>;
  }

  // 관리자가 아닌 경우는 렌더링되지 않도록 null 반환
  if (!user || user.role !== "admin") {
    return null;
  }

  // 관리자일 경우에만 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AdminRoute;
