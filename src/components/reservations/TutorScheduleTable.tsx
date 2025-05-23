"use client";

import { useReservations } from "../../context/ReservationContext";
import { useAvailability } from "../../context/AvailabilityContext";
import { Reservation } from "../../types/reservation";
import { useTutors } from "../../context/TutorContext";
import { useMemo, useState } from "react";
import Button from "../shared/Button";

interface TutorScheduleTableProps {
  tutorName: string;
  isAdmin: boolean;
  isTutor: boolean;
  onView: (reservation: Reservation) => void;
  onCancel?: (id: string) => void;
}

const TutorScheduleTable = ({
  tutorName,
  isAdmin,
  isTutor,
  onView,
  onCancel,
}: TutorScheduleTableProps) => {
  const { availability } = useAvailability();
  const { reservations } = useReservations();
  const { tutors } = useTutors();
  const [selectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // 요일 자동 추출 함수
  const getDayOfWeek = (date: string): string => {
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const parsedDate = new Date(date);
    return days[parsedDate.getDay()];
  };

  // 선택된 날짜의 요일
  const selectedDayOfWeek = useMemo(
    () => getDayOfWeek(selectedDate),
    [selectedDate]
  );

  // 튜터 ID 찾기 (튜터 이름 기반)
  const selectedTutor = tutors.find((tutor) => tutor.name === tutorName);
  const tutorID = selectedTutor?.id || "";

  // 해당 튜터의 시간대 로드 (요일 기반)
  const rawTimeSlots = availability[tutorID]?.[selectedDayOfWeek] || [];

  const timeSlots = [...rawTimeSlots].sort((a, b) => {
    const getStartMinutes = (time: string) => {
      const [start] = time.split("-");
      const [h, m] = start.split(":").map(Number);
      return h * 60 + m;
    };
    return getStartMinutes(a) - getStartMinutes(b);
  });

  const getReservationForSlot = (slot: string) => {
    return reservations.find(
      (res) => res.tutor === tutorName && res.timeSlot === slot
    );
  };

  if (timeSlots.length === 0) {
    return (
      <p className='text-center text-gray-400 py-6'>
        설정된 가능 시간이 없습니다.
      </p>
    );
  }

  return (
    <div className='mt-4'>
      <table className='w-full text-sm border border-gray-200 rounded overflow-hidden'>
        <thead>
          <tr className='bg-blue-50 text-blue-800 text-left'>
            <th className='px-4 py-2 border'>시간</th>
            <th className='px-4 py-2 border'>예약자</th>
            <th className='px-4 py-2 border'>관리</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => {
            const reservation = getReservationForSlot(slot);
            const isBooked = !!reservation;
            return (
              <tr
                key={slot}
                className={
                  isBooked
                    ? "bg-gray-100 text-gray-700"
                    : "bg-white text-gray-400"
                }
              >
                <td className='px-4 py-2 border'>{slot}</td>
                <td className='px-4 py-2 border'>
                  {isBooked ? reservation?.teamName : "-"}
                </td>
                <td className='px-4 py-2 border'>
                  <div className='flex gap-2'>
                    {isBooked ? (
                      <Button
                        variant='primary'
                        className='text-xs'
                        onClick={() => reservation && onView(reservation)}
                      >
                        보기
                      </Button>
                    ) : (
                      <span className='text-gray-300'>-</span>
                    )}
                    {isBooked && (isAdmin || isTutor) && onCancel && (
                      <Button
                        variant='warning'
                        className='text-xs'
                        onClick={() => onCancel(reservation!.id)}
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TutorScheduleTable;
