"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarClock,
  ShieldCheck,
  UserCheck,
  LogIn,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { isAdminRole } from "../../utils/roleUtils";
import { useToast } from "../../hooks/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { ConfirmAlertDialog } from "../shared/ConfirmAlertDialog";
import { useState } from "react";
import MobileMenuSheet from "../layout/MobileMenuSheet";

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

  const [mobileOpen, setMobileOpen] = useState(false);

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

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className='app-header'>
        <div className='page-wrap h-[64px] flex items-center justify-between'>
          {/* Left: Brand */}
          <Link to='/' className='flex items-center gap-2'>
            <span className='brand-chip h-8 w-8 rounded-2xl grid place-items-center'>
              <CalendarClock className='h-5 w-5' />
            </span>
            <span className='text-[16px] font-semibold text-neutral-900'>
              BOOKABLE
            </span>
          </Link>

          {/* Center: Nav Tabs (데스크톱 전용) */}
          <nav className='hidden md:flex items-center gap-1'>
            <NavLink
              to='/reservation'
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              예약하기
            </NavLink>
            <NavLink
              to='/status'
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              실시간 예약 현황
            </NavLink>
            <NavLink
              to='/mypage'
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              내 예약
            </NavLink>
          </nav>

          {/* Right: Actions */}
          <div className='flex items-center gap-3'>
            {/* 알림 버튼 */}
            <button
              type='button'
              className='ghost-btn p-2 rounded-full'
              title='알림'
            >
              <Bell className='h-5 w-5' />
            </button>

            {/* 로그인/아웃 & 역할 단추 */}
            {!user ? (
              <Link to='/login' className='primary-btn hidden sm:inline-flex'>
                <LogIn className='h-4 w-4' />
                <span>로그인</span>
              </Link>
            ) : (
              <>
                {(isAdmin || isTutor) && (
                  <Link
                    to={isAdmin ? "/admin" : "/tutor"}
                    className='ghost-btn'
                    title={
                      isAdmin ? "관리자 페이지로 이동" : "튜터 페이지로 이동"
                    }
                  >
                    {isAdmin ? (
                      <ShieldCheck className='h-5 w-5' />
                    ) : (
                      <UserCheck className='h-5 w-5' />
                    )}
                  </Link>
                )}
                <button
                  onClick={() => setOpenConfirm(true)}
                  className='ghost-btn hidden sm:inline-flex'
                  title='로그아웃'
                >
                  <LogOut className='h-5 w-5' />
                </button>
              </>
            )}

            {/* 모바일 햄버거: md 미만에서 보임 */}
            <button
              type='button'
              className='ghost-btn p-2 rounded-full md:hidden'
              aria-label='메뉴 열기'
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 패널 */}
        <MobileMenuSheet
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          user={user}
          isAdmin={isAdmin}
          isTutor={isTutor}
        />
      </header>
    </>
    // <>
    //   {/* 중앙 정렬된 제목 */}
    //   <header className='text-center mb-6'>
    //     <h1 className='text-3xl font-bold text-gray-800'>튜터링 예약 시스템</h1>
    //     <p className='text-sm text-gray-5 00 mt-2'>오늘: {today}</p>

    //     {/* 로그인하지 않은 사용자에게 로그인 버튼 */}
    //     {!user && (
    //       <Link
    //         to='/login'
    //         className='absolute top-6 right-6 text-gray-600 hover:text-black flex items-center gap-1'
    //       >
    //         <LogIn className='w-5 h-5' />
    //         <span className='text-sm'>로그인</span>
    //       </Link>
    //     )}
    //     {/* 로그인한 사용자: 관리자/튜터 아이콘 + 로그아웃 버튼 */}
    //     {user && (
    //       <div className='absolute top-6 right-6 flex items-center gap-4'>
    //         {(isAdmin || isTutor) && (
    //           <Link
    //             to={isAdmin ? "/admin" : "/tutor"}
    //             className='text-gray-600 hover:text-black'
    //             title={isAdmin ? "관리자 페이지로 이동" : "튜터 페이지로 이동"}
    //           >
    //             {isAdmin ? (
    //               <ShieldCheck className='w-6 h-6' />
    //             ) : (
    //               <UserCheck className='w-6 h-6' />
    //             )}
    //           </Link>
    //         )}
    //         <button
    //           onClick={() => setOpenConfirm(true)}
    //           className='text-gray-600 hover:text-black flex items-center gap-1 text-sm'
    //           title='로그아웃'
    //         >
    //           <LogOut className='w-5 h-5' />
    //           로그아웃
    //         </button>

    //         {/* 확인 모달 */}
    //         <ConfirmAlertDialog
    //           open={openConfirm}
    //           title='로그아웃 하시겠습니까?'
    //           description='로그아웃 후에는 다시 로그인해야 합니다.'
    //           confirmLabel='로그아웃'
    //           onConfirm={handleLogout}
    //           onCancel={() => setOpenConfirm(false)}
    //           isLoading={isLoading}
    //         />
    //       </div>
    //     )}
    //   </header>
    // </>
  );
};

export default Header;
