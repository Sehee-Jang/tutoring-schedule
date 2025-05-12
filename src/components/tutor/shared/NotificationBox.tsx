// 오늘 예약 알림 박스
import React from "react";

interface NotificationBoxProps {
  count: number;
}

const NotificationBox = ({ count }: NotificationBoxProps) => {
  return (
    <div className='w-[166px] rounded-[4px] border border-[#FFEF8A] bg-[#FEFCE8] px-[12px] py-[8px]'>
      <p className='text-[14px] leading-[24px] font-semibold text-[#854D0F]'>
        오늘 예약 <span>{count}</span>건
      </p>
      <p className='text-[12px] leading-[24px] font-medium text-[#CA8A03]'>
        오늘 예약을 확인하세요
      </p>
    </div>
  );
};

export default NotificationBox;
