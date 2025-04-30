"use client";

import { useReservations } from "../../context/ReservationContext";
import { useAvailability } from "../../context/AvailabilityContext";
import { useState } from "react";
import { Reservation } from "../../types/reservation";
import PrimaryButton from "../shared/PrimaryButton";
import ModalLayout from "../shared/ModalLayout";

interface TutorScheduleTableProps {
  tutorName: string;
  isAdmin: boolean;
  onView: (reservation: Reservation) => void;
}

const TutorScheduleTable = ({
  tutorName,
  isAdmin,
  onView,
}: TutorScheduleTableProps) => {
  const { availability } = useAvailability();
  const { reservations } = useReservations();

  const timeSlots = availability[tutorName] || [];

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
            <th className='px-4 py-2 border'>보기</th>
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
                  {isBooked ? (
                    <PrimaryButton
                      onClick={() => reservation && onView(reservation)}
                    >
                      보기
                    </PrimaryButton>
                  ) : (
                    <span className='text-gray-300'>-</span>
                  )}
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
