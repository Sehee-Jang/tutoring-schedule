import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { showModal } = useModal();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className='text-center p-8'>Loading...</div>;
  }

  // if (!user) {
  //   // 로그인 안했으면 로그인 페이지로 보내기 (예시로 / 사용)
  //   return <Navigate to='/' replace />;
  // }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='p-10 text-center space-y-6 bg-white rounded-xl shadow max-w-md w-full'>
          <h2 className='text-2xl font-bold text-gray-800'>
            로그인 후 이용 가능한 서비스입니다.
          </h2>
          <div className='flex justify-center gap-4'>
            <Button variant='primary' onClick={() => showModal("login")}>
              로그인
            </Button>
            <Button variant='outline' onClick={() => navigate("/")}>
              돌아가기
            </Button>
          </div>
          <div></div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
