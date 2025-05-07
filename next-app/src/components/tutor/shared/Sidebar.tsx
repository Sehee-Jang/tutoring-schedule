// 좌측 메뉴 & 알림
"use client";

import React from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { useReservations } from "@/context/ReservationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  setViewMode: (mode: "timeSettings" | "reservations") => void;
}
const Sidebar = ({ setViewMode }: SidebarProps) => {
  const { reservations } = useReservations();
  const { user } = useAuth();
  const router = useRouter();

  // 오늘 날짜 형식
  const today = new Date().toISOString().split("T")[0];

  // 오늘 예약 건수
  const todayReservations = reservations.filter(
    (r) => r.tutor === user?.name && r.date === today
  );

  return (
    <div className='py-5 px-3 text-sm space-y-5 '>
      {/* 메뉴 섹션 */}
      <nav className='space-y-4 border-b border-gray-200 pb-5'>
        <button
          // onClick={() => router.push("/tutor")}
          onClick={() => setViewMode("timeSettings")}
          className='w-[166px] flex items-center font-semibold text-gray-700 hover:text-blue-600 justify-evenly'
        >
          <Clock className='w-4 h-4' />
          튜터링 시간 설정
        </button>
        <button
          onClick={() => setViewMode("reservations")}
          className='w-[166px] flex items-center font-semibold text-gray-700 hover:text-blue-600 justify-evenly'
        >
          <CalendarCheck className='w-4 h-4' />
          실시간 예약 확인
        </button>
      </nav>

      {/* 알림 섹션 */}
      <div className='space-y-2'>
        <h4 className='font-semibold text-gray-700'>알림</h4>
        <div className='w-[166px] rounded-[4px] border border-[#FFEF8A] bg-[#FEFCE8] px-[12px] py-[8px]'>
          <p className='text-[14px] leading-[24px] font-semibold text-[#854D0F]'>
            오늘 예약 <span>{todayReservations.length}</span>건
          </p>
          <p className='text-[12px] leading-[24px] font-medium text-[#CA8A03]'>
            오늘 예약을 확인하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
