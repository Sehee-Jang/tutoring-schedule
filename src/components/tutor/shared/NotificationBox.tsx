import React from "react";

interface NotificationBoxProps {
  count: number;
  isCompact?: boolean; // 사이드바용 슬림 스타일 여부
}

const NotificationBox = ({
  count,
  isCompact = false,
}: NotificationBoxProps) => {
  if (isCompact) {
    return (
      <div className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 text-gray-700 text-sm justify-start'>
        <span>📌</span>
        <span>오늘 예약: {count}건</span>
      </div>
    );
  }

  return (
    <div className='w-full rounded-[4px] border border-[#FFEF8A] bg-[#FEFCE8] px-4 py-3'>
      <p className='text-sm font-semibold text-[#854D0F]'>
        오늘 예약 <span>{count}</span>건
      </p>
      <p className='text-xs font-medium text-[#CA8A03]'>
        오늘 예약을 확인하세요
      </p>
    </div>
  );
};

export default NotificationBox;
