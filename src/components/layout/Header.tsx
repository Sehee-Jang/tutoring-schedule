"use client";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, UserCheck, LogIn, LogOut } from "lucide-react";
import { isAdminRole } from "../../utils/roleUtils";
import { useToast } from "../../hooks/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { ConfirmAlertDialog } from "../shared/ConfirmAlertDialog";
import { useState } from "react";

const Header = () => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const isTutor = user?.role === "tutor";
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "오류",
        description: "로그아웃 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOpenConfirm(false);
    }
  };

  return (
    <>
      {/* 중앙 정렬된 제목 */}
      <header className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>튜터링 예약 시스템</h1>
        <p className='text-sm text-gray-500 mt-2'>오늘: {today}</p>

        {/* 로그인하지 않은 사용자에게 로그인 버튼 */}
        {!user && (
          <Link
            to='/login'
            className='absolute top-6 right-6 text-gray-600 hover:text-black flex items-center gap-1'
          >
            <LogIn className='w-5 h-5' />
            <span className='text-sm'>로그인</span>
          </Link>
        )}
        {/* 로그인한 사용자: 관리자/튜터 아이콘 + 로그아웃 버튼 */}
        {user && (
          <div className='absolute top-6 right-6 flex items-center gap-4'>
            {(isAdmin || isTutor) && (
              <Link
                to={isAdmin ? "/admin" : "/tutor"}
                className='text-gray-600 hover:text-black'
                title={isAdmin ? "관리자 페이지로 이동" : "튜터 페이지로 이동"}
              >
                {isAdmin ? (
                  <ShieldCheck className='w-6 h-6' />
                ) : (
                  <UserCheck className='w-6 h-6' />
                )}
              </Link>
            )}
            <button
              onClick={() => setOpenConfirm(true)}
              className='text-gray-600 hover:text-black flex items-center gap-1 text-sm'
              title='로그아웃'
            >
              <LogOut className='w-5 h-5' />
              로그아웃
            </button>

            {/* 확인 모달 */}
            <ConfirmAlertDialog
              open={openConfirm}
              title='로그아웃 하시겠습니까?'
              description='로그아웃 후에는 다시 로그인해야 합니다.'
              confirmLabel='로그아웃'
              onConfirm={handleLogout}
              onCancel={() => setOpenConfirm(false)}
              isLoading={isLoading}
            />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
