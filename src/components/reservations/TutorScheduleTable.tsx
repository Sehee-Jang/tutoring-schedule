"use client";

import { useReservations } from "../../context/ReservationContext";
import { useAvailability } from "../../context/AvailabilityContext";
import { Reservation } from "../../types/reservation";

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
  const rawTimeSlots = availability[tutorName] || [];

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
                      <button
                        onClick={() => reservation && onView(reservation)}
                        className='bg-blue-500 text-white px-3 py-1 rounded text-xs'
                      >
                        보기
                      </button>
                    ) : (
                      <span className='text-gray-300'>-</span>
                    )}
                    {isBooked && (isAdmin || isTutor) && onCancel && (
                      <button
                        onClick={() => onCancel(reservation!.id)}
                        className='bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-xs'
                      >
                        삭제
                      </button>
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
