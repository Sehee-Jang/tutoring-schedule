// 좌측 메뉴 & 알림
"use client";

import { CalendarCheck, Clock } from "lucide-react";
import { useReservations } from "../../../context/ReservationContext";
import { useAuth } from "../../../context/AuthContext";
import NotificationBox from "./NotificationBox";

interface SidebarProps {
  setViewMode: (mode: "reservations" | "timeSettings") => void;
  viewMode: "reservations" | "timeSettings";
}
const Sidebar = ({ setViewMode, viewMode }: SidebarProps) => {
  const { reservations } = useReservations();
  const { user } = useAuth();

  // 오늘 날짜 형식 (로컬 시간, 한국 시간 UTC+9)
  const today = new Date();
  const localToday = new Date(today.getTime() + 9 * 60 * 60 * 1000) // UTC+9 (KST)
    .toISOString()
    .split("T")[0];

  // 오늘 예약 건수 (classDate 사용)
  const todayReservations = reservations.filter(
    (r) =>
      r.tutor === user?.name &&
      r.classDate && // classDate가 존재하는지 확인
      r.classDate === localToday
  );

  return (
    <div className='py-5 px-3 text-sm space-y-5 '>
      {/* 메뉴 섹션 */}
      <nav className='space-y-4 border-b border-gray-200 pb-5'>
        <button
          onClick={() => setViewMode("reservations")}
          className={`w-[166px] flex items-center font-semibold justify-evenly px-4 py-2 rounded-md ${
            viewMode === "reservations"
              ? "bg-[#DBE9FE] text-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
        >
          <CalendarCheck className='w-4 h-4' />
          실시간 예약 확인
        </button>
        <button
          onClick={() => setViewMode("timeSettings")}
          className={`w-[166px] flex items-center font-semibold justify-evenly px-4 py-2 rounded-md ${
            viewMode === "timeSettings"
              ? "bg-[#DBE9FE] text-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
        >
          <Clock className='w-4 h-4' />
          튜터링 시간 설정
        </button>
      </nav>

      {/* 알림 섹션 */}
      <div className='space-y-2'>
        <h4 className='font-semibold text-gray-700'>알림</h4>
        <NotificationBox count={todayReservations.length} />
      </div>
    </div>
  );
};

export default Sidebar;
