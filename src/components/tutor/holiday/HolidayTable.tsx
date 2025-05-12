// 휴무일 목록 테이블
import { Holiday } from "../../../types/tutor";
import React from "react";

interface HolidayTableProps {
  holidays: Holiday[];
  formatDate: (date: string) => string;
  deleteHoliday: (id: string) => void;
}

const HolidayTable: React.FC<HolidayTableProps> = ({
  holidays,
  formatDate,
  deleteHoliday,
}) => {
  return (
    <table className='w-full border text-sm border-gray-200'>
      <thead>
        <tr className='bg-gray-50 border-b border-gray-200'>
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
        {holidays.map((h: Holiday) => (
          <tr key={h.id}>
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
