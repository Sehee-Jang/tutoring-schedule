import { createPortal } from "react-dom";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { X, ShieldCheck, UserCheck, LogOut, LogIn } from "lucide-react";

export default function MobileMenuSheet({
  open,
  onClose,
  user,
  isAdmin,
  isTutor,
}: {
  open: boolean;
  onClose: () => void;
  user: { role?: string } | null;
  isAdmin: boolean;
  isTutor: boolean;
}) {
  // 스크롤 잠금
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (open) html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const sheet = (
    <>
      {/* 오버레이 - 뷰포트 전역, 높은 z-index */}
      <button
        aria-label='메뉴 닫기'
        className='fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[90]'
        onClick={onClose}
      />
      {/* 사이드 패널 - 뷰포트 전역 */}
      <div
        className='fixed top-0 right-0 h-dvh w-[78vw] max-w-[320px] bg-white shadow-xl z-[100]
                   px-4 py-4 flex flex-col gap-2 transition-transform duration-200
                   will-change-transform translate-x-0'
        role='dialog'
        aria-modal='true'
      >
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <img
              src='/images/logo/header_logo.png'
              alt='Bookable'
              className='h-7 w-auto'
              draggable={false}
            />
          </div>
          <button
            className='ghost-btn p-2 rounded-full'
            onClick={onClose}
            aria-label='메뉴 닫기'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <nav className='flex flex-col gap-1'>
          <NavLink
            to='/reservation'
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            예약하기
          </NavLink>
          <NavLink
            to='/status'
            end
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            실시간 예약 현황
          </NavLink>
          <NavLink
            to='/mypage'
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            내 예약
          </NavLink>
        </nav>

        <div className='mt-4 border-t pt-4 flex flex-col gap-2'>
          {!user ? (
            <Link
              to='/login'
              onClick={onClose}
              className='primary-btn justify-center'
            >
              <LogIn className='h-4 w-4' />
              <span>로그인</span>
            </Link>
          ) : (
            <>
              {(isAdmin || isTutor) && (
                <Link
                  to={isAdmin ? "/admin" : "/tutor"}
                  onClick={onClose}
                  className='ghost-btn justify-start'
                >
                  {isAdmin ? (
                    <ShieldCheck className='h-5 w-5' />
                  ) : (
                    <UserCheck className='h-5 w-5' />
                  )}
                  <span className='ml-2'>
                    {isAdmin ? "관리자 페이지" : "튜터 페이지"}
                  </span>
                </Link>
              )}
              <button onClick={onClose} className='ghost-btn justify-start'>
                <LogOut className='h-5 w-5' />
                <span className='ml-2'>로그아웃</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(sheet, document.body);
}
