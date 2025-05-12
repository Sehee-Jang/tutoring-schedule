"use client";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, UserCheck } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";

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

        {/* {(isAdmin || isTutor) && (
          <button
            onClick={() => showModal("availability")}
            className='absolute top-5 right-5 text-gray-700 hover:text-black'
            title='튜터링 시간 설정'
          >
            <Settings className='w-5 h-5' />
          </button>
        )} */}

        {/* 관리자 페이지 이동 버튼 */}
        {(isAdmin || isTutor) && (
          <div className='mt-6 flex justify-center'>
            <Link
              to={isAdmin ? "/admin" : "/tutor"}
              className='absolute top-6 right-6 text-gray-600 hover:text-black'
              title={isAdmin ? "관리자 페이지로 이동" : "튜터 페이지로 이동"}
            >
              {isAdmin ? (
                <ShieldCheck className='w-6 h-6' />
              ) : (
                <UserCheck className='w-6 h-6' />
              )}
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
