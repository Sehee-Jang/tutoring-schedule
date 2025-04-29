"use client";

import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ModalRenderer from "../shared/ModalRenderer";
import { logout } from "../../services/auth";
import ReservationTabs from "../reservation/ReservationTabs";

const AppContent = () => {
  const { user } = useAuth();
  const isAdmin: boolean = user?.role === "admin";
  const { showModal } = useModal();

  const today: string = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className='relative max-w-5xl mx-auto px-4 py-6 font-sans bg-gray-50 min-h-screen'>
      {/* 우측 상단 로그인/로그아웃 */}
      <div className='absolute top-4 right-4'>
        {!user ? (
          <button
            onClick={() => showModal("login")}
            className='text-sm bg-[#262626] text-white px-4 py-2 rounded hover:bg-[#404040]'
          >
            로그인
          </button>
        ) : (
          <button
            onClick={logout}
            className='text-sm text-gray-800 px-4 py-2 rounded hover:text-gray-600'
          >
            로그아웃
          </button>
        )}
      </div>

      {/* 중앙 정렬된 제목 */}
      <header className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>튜터링 예약 시스템</h1>
        <p className='text-sm text-gray-500 mt-2'>오늘: {today}</p>

        {isAdmin && (
          <button
            onClick={() => showModal("availability")}
            className='mt-4 bg-[#262626] text-white px-4 py-2 rounded hover:bg-[#404040]'
          >
            튜터링 시간 설정
          </button>
        )}
      </header>

      <ReservationTabs isAdmin={isAdmin} />

      <ModalRenderer />
    </div>
  );
};

export default AppContent;
