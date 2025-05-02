"use client";

import { Reservation } from "../../types/reservation";
import { ChevronDown } from "lucide-react";

interface PastReservationTableProps {
  reservations: Reservation[];
  visibleCount: number;
  onLoadMore: () => void;
  onView: (res: Reservation) => void;
  onCancel: (id: string) => void;
  isAdmin: boolean;
}

const PastReservationTable = ({
  reservations,
  visibleCount,
  onLoadMore,
  onView,
  onCancel,
  isAdmin,
}: PastReservationTableProps) => {
  if (reservations.length === 0) {
    return (
      <p className='text-center text-gray-400 py-6'>지난 예약이 없습니다.</p>
    );
  }

  return (
    <>
      <table className='w-full text-sm border border-gray-200 rounded overflow-hidden'>
        <thead>
          <tr className='bg-blue-50 text-blue-800 text-left'>
            <th className='px-4 py-2 border'>튜터명</th>
            <th className='px-4 py-2 border'>시간</th>
            <th className='px-4 py-2 border'>예약자</th>
            {isAdmin && <th className='px-4 py-2 border'>관리</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.slice(0, visibleCount).map((res: Reservation) => (
            <tr key={res.id} className='even:bg-gray-50'>
              <td className='px-4 py-2 border'>{res.tutor}</td>
              <td className='px-4 py-2 border'>{res.timeSlot}</td>
              <td className='px-4 py-2 border'>{res.teamName}</td>
              {(isAdmin) && (
                <td className='px-4 py-2 border'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onView(res)}
                      className='bg-blue-500 text-white px-3 py-1 rounded text-xs'
                    >
                      보기
                    </button>
                    <button
                      onClick={() => onCancel(res.id)}
                      className='bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-xs'
                    >
                      삭제
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {reservations.length > visibleCount && (
        <div className='flex justify-center mt-6'>
          <button
            onClick={onLoadMore}
            className='flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm font-semibold transition'
          >
            <ChevronDown className='w-4 h-4' />
            더보기
          </button>
        </div>
      )}
    </>
  );
};

export default PastReservationTable;
