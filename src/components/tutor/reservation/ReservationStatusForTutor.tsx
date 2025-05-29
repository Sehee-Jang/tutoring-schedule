"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useReservations } from "../../../context/ReservationContext";
import { format } from "date-fns";
import { generateTimeSlots } from "../../../utils/generateTimeSlots"; // 시간대 생성 함수
import ReservationCard from "./ReservationCard";
import DateSelector from "../../../components/shared/DateSelector";
import { fetchAvailableSlotsByDate } from "../../../services/availability";
import { getDayOfWeek } from "../../../utils/getDayOfWeek";

const ReservationStatusForTutor = () => {
  const { user } = useAuth();
  const { reservations } = useReservations();
  const [date, setDate] = useState<Date>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const timeSlots = generateTimeSlots("09:00", "21:00", 30); // 09:00 - 21:00 시간대 생성

  // 날짜 변경 시 해당 날짜의 가능한 시간대 불러오기
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user) return;

      const selectedDay = getDayOfWeek(date);

      const availability = await fetchAvailableSlotsByDate(
        user.id,
        selectedDay
      );

      // 시간대만 추출하여 상태로 설정
      const slots = availability.flatMap((item) => item.activeSlots);
      setAvailableTimeSlots(slots.length > 0 ? slots : []);
    };

    fetchAvailability();
  }, [date, user]);

  // 선택된 날짜의 예약 필터링
  const filteredReservations = reservations.filter(
    (res) =>
      res.tutor === user?.name && res.classDate === format(date, "yyyy-MM-dd")
  );

  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>
        실시간 예약 현황
      </h2>

      {/* 날짜 선택 바 */}
      <DateSelector date={date} setDate={setDate} />

      <div className='border border-gray-200 rounded-md overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='w-[160px] p-3 text-center border-r border-gray-200'>
                시간
              </th>
              <th className='p-3 text-center'>예약</th>
            </tr>
          </thead>

          <tbody>
            {timeSlots.map((slot) => {
              const isAvailable = availableTimeSlots.includes(slot);
              if (!isAvailable) return null;

              return (
                <tr key={slot} className='border-t border-gray-200'>
                  <td className='w-[160px] h-[76px] p-3 text-center text-gray-700 border-r border-gray-200'>
                    {slot}
                  </td>
                  <td className='h-[76px] p-3 space-y-2'>
                    {filteredReservations.filter((r) =>
                      r.timeSlot.startsWith(slot)
                    ).length === 0 ? (
                      <p className='text-gray-400 text-center'>예약 없음</p>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationStatusForTutor;
