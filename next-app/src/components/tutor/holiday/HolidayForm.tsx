// 휴무일 입력 폼
import React, { useState } from "react";

const HolidayForm = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  addHoliday,
  isDateInvalid,
}: any) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end min-h-[76px]'>
      <div className='flex flex-col space-y-1'>
        <label className='text-sm text-gray-700'>시작일</label>
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='border border-gray-200 rounded px-3 py-2 text-sm text-gray-400'
        />
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-sm font-medium text-gray-700'>종료일</label>
        <input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`border ${
            isDateInvalid ? "border-red-500" : "border-gray-200"
          } rounded px-3 py-2 text-sm text-gray-400`}
        />
      </div>

      <div className='flex flex-col space-y-1'>
        <label className='text-sm text-gray-700'>사유</label>
        <input
          type='text'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder='휴가, 세미나 참석 등'
          className='border border-gray-200 rounded px-3 py-2 text-sm text-gray-400'
        />
      </div>

      <div className='flex items-end'>
        <button
          onClick={addHoliday}
          disabled={isDateInvalid}
          className={`text-sm px-4 py-2 rounded w-full ${
            isDateInvalid
              ? "bg-gray-200 text-white cursor-not-allowed"
              : "bg-gray-400 text-white hover:bg-[#1f1f1f]"
          }`}
        >
          휴무일 추가
        </button>
      </div>
    </div>
  );
};

export default HolidayForm;
