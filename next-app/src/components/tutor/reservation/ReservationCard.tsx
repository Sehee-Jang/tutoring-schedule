import React, { useState } from "react";
import type { Reservation } from "@/types/reservation";

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className='bg-blue-50 p-3 rounded-md shadow-sm cursor-pointer hover:bg-blue-100 transition relative'
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className='flex items-center justify-between'>
        <p className='font-semibold'>{reservation.teamName}</p>
        <span className='text-gray-500 text-xs'>{reservation.timeSlot}</span>
      </div>
      <p className='text-sm text-blue-600 mt-1'>
        <a
          href={reservation.resourceLink}
          target='_blank'
          rel='noopener noreferrer'
        >
          {reservation.resourceLink}
        </a>
      </p>

      {expanded && (
        <div className='mt-2 text-sm text-gray-700'>
          <p>{reservation.question}</p>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
