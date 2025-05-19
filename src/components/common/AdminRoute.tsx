import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { useNavigate } from "react-router-dom";

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
            <button
              onClick={() => showModal("login")}
              className='bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700'
            >
              로그인
            </button>
          </div>
          <div className='pt-4'>
            <button
              onClick={() => navigate("/")}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
            >
              ← 메인으로 돌아가기
            </button>
          </div>
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
