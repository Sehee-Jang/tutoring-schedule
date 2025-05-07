"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useReservations } from "@/context/ReservationContext";
import { format, addDays, subDays } from "date-fns";
import { generateTimeSlots } from "@/utils/generateTimeSlots"; // 시간대 생성 함수
import type { Reservation } from "@/types/reservation";
import ReservationCard from "./ReservationCard";

const ReservationStatusForTutor = () => {
  const { user } = useAuth();
  const { reservations } = useReservations();
  const [date, setDate] = useState(new Date());
  const timeSlots = generateTimeSlots(9, 21); // 09:00 - 21:00 시간대 생성

  // 날짜 변경 핸들러
  const handlePrevDay = () => setDate((prev) => subDays(prev, 1));
  const handleNextDay = () => setDate((prev) => addDays(prev, 1));

  // 선택된 날짜의 예약 필터링
  const filteredReservations = reservations.filter(
    (res) =>
      res.tutor === user?.name && res.classDate === format(date, "yyyy-MM-dd")
  );

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>실시간 예약 현황</h2>
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={handlePrevDay}
          className='text-gray-600 hover:text-blue-600'
        >
          &lt;
        </button>
        <h3 className='text-xl font-semibold'>
          {format(date, "yyyy년 MM월 dd일 (EEEE)")}
        </h3>
        <button
          onClick={handleNextDay}
          className='text-gray-600 hover:text-blue-600'
        >
          &gt;
        </button>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <table className='w-full border text-sm'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='p-3 border-r text-left w-24'>시간</th>
              <th className='p-3 text-left'>예약</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot} className='border-t'>
                <td className='p-3 border-r text-gray-700'>{slot}</td>
                <td className='p-3 space-y-2'>
                  {filteredReservations.filter((r) =>
                    r.timeSlot.startsWith(slot)
                  ).length === 0 ? (
                    <p className='text-gray-400'>예약 없음</p>
                  ) : (
                    filteredReservations
                      .filter((r) => r.timeSlot.startsWith(slot))
                      .map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          reservation={reservation}
                        />
                      ))
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationStatusForTutor;
