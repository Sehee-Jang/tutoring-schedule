"use client";

import { useModal } from "../../context/ModalContext";
import { Reservation } from "../../types/reservation";

interface ReservationCardProps {
  reservation: Reservation;
}

const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const { showModal } = useModal();

  const handleViewDetail = () => {
    showModal("reservationDetail", { reservation });
  };

  return (
    <li className='border rounded-xl p-4 shadow-sm flex justify-between items-center'>
      <div>
        <p className='font-semibold'>{reservation.teamName}</p>
        <p className='text-sm text-gray-500'>
          {reservation.date} {reservation.timeSlot}
        </p>
        <p className='text-sm text-gray-600'>상태: {reservation.status}</p>
      </div>
      <button
        onClick={handleViewDetail}
        className='text-sm text-blue-600 hover:underline'
      >
        보기
      </button>
    </li>
  );
};

export default ReservationCard;
