"use client";

import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { Settings } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";
  const { showModal } = useModal();

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <>
      {/* 중앙 정렬된 제목 */}
      <header className='text-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>튜터링 예약 시스템</h1>
        <p className='text-sm text-gray-500 mt-2'>오늘: {today}</p>

        {(isAdmin || isTutor) && (
          <button
            onClick={() => showModal("availability")}
            className='absolute top-5 right-5 text-gray-700 hover:text-black'
            title='튜터링 시간 설정'
          >
            <Settings className='w-5 h-5' />
          </button>
        )}
      </header>
    </>
  );
};

export default Header;
