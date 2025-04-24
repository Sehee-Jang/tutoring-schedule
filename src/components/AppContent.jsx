import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import ReservationStatus from "./ReservationStatus";
import AvailabilityModal from "./AvailabilityModal";
import ReservationForm from "./ReservationForm";
import { logout } from "../services/auth";

const AppContent = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [showLogin, setShowLogin] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);

  const today = new Date().toLocaleDateString("ko-KR", {
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
            onClick={() => setShowLogin(true)}
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
            onClick={() => setShowAvailability(true)}
            className='mt-4 bg-[#262626] text-white px-4 py-2 rounded hover:bg-[#404040]'
          >
            튜터링 시간 설정
          </button>
        )}
      </header>

      <ReservationStatus isAdmin={isAdmin} />
      <AvailabilityModal
        isOpen={showAvailability}
        onClose={() => setShowAvailability(false)}
      />
      <ReservationForm />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default AppContent;
