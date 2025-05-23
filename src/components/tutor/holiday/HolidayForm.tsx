import Button from "../../shared/Button";
import React from "react";

interface HolidayFormProps {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  addHoliday: () => void;
  isDateInvalid: boolean;
}

const HolidayForm: React.FC<HolidayFormProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  addHoliday,
  isDateInvalid,
}) => {
  return (
    <div className='flex items-end gap-4 min-h-[76px]'>
      {/* 시작일 */}
      <div className='flex-1 flex flex-col space-y-1'>
        <label className='text-sm text-gray-700'>시작일</label>
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='border border-gray-200 rounded px-3 py-2 text-sm text-gray-400'
        />
      </div>

      {/* 종료일 */}
      <div className='flex-1 flex flex-col space-y-1'>
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

      {/* 사유 */}
      <div className='flex-auto flex flex-col space-y-1'>
        <label className='text-sm text-gray-700'>사유</label>
        <input
          type='text'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder='휴가, 세미나 참석 등'
          className='border border-gray-200 rounded px-3 py-2 text-sm text-gray-400'
        />
      </div>

      {/* 휴무일 추가 버튼 */}
      <div className='flex items-end'>
        <Button
          className={`text-sm  ${
            isDateInvalid
              ? "bg-gray-200 text-white cursor-not-allowed"
              : "bg-gray-400 text-white hover:bg-[#1f1f1f]"
          }`}
          variant='primary'
          disabled={isDateInvalid}
          onClick={addHoliday}
        >
          설정 저장
        </Button>
      </div>
    </div>
  );
};

export default HolidayForm;
