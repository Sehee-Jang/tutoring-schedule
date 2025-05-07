// 휴무일 목록 테이블
import React from "react";
import { Holiday } from "@/types/tutor";

const HolidayTable = ({ holidays, formatDate, deleteHoliday }: any) => {
  return (
    <table className='w-full border text-sm'>
      <thead>
        <tr className='bg-gray-50 border-b'>
          <th className='p-2 border-r border-gray-200 text-left text-gray-700 w-64'>
            기간
          </th>
          <th className='p-2 border-r border-gray-200 text-left text-gray-700'>
            사유
          </th>
          <th className='p-2 text-center text-gray-700 w-32'>관리</th>
        </tr>
      </thead>
      <tbody>
        {holidays.map((h: any) => (
          <tr key={h.id} className='border-t'>
            <td className='p-2 border-r border-gray-200 text-gray-700'>
              {h.endDate
                ? `${formatDate(h.startDate)} - ${formatDate(h.endDate)}`
                : formatDate(h.startDate)}
            </td>
            <td className='p-2 border-r border-gray-200 text-gray-700'>
              {h.reason}
            </td>
            <td className='p-2 text-red-500 text-center'>
              <button
                onClick={() => deleteHoliday(h.id)}
                className='hover:underline'
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HolidayTable;
