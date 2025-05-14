"use client";

import TimeSlotSetting from "./TimeSlotSetting";
import HolidaySetting from "../holiday/HolidaySetting";

const TimeSettingsPanel = () => {
  return (
    <div className='space-y-12'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>
        튜터링 시간 설정
      </h2>
      <section>
        <h3 className='text-gray-700 text-l font-semibold mb-4'>
          요일별 시간 설정
        </h3>
        <TimeSlotSetting />
      </section>

      <section>
        <h3 className='text-gray-700 text-l font-semibold mb-4'>휴무일 설정</h3>
        <HolidaySetting />
      </section>
    </div>
  );
};

export default TimeSettingsPanel;
