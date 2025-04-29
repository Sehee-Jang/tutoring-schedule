"use client";

import { useState } from "react";
import ReservationForm from "./ReservationForm";
import ReservationStatus from "./ReservationStatus";
import TabButton from "../shared/TabButton";

const ReservationTabs = () => {
  const [activeTab, setActiveTab] = useState<"form" | "status">("form");

  const handleReservationSuccess = () => {
    setActiveTab("status");
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {/* 탭 버튼 */}
      <div className='flex justify-center gap-4 mb-8'>
        <TabButton
          isActive={activeTab === "form"}
          onClick={() => setActiveTab("form")}
        >
          튜터링 예약하기
        </TabButton>
        <TabButton
          isActive={activeTab === "status"}
          onClick={() => setActiveTab("status")}
        >
          실시간 예약 현황
        </TabButton>
      </div>

      {/* 탭 내용 */}
      <div className='space-y-6 min-h-[700px]'>
        {activeTab === "form" && (
          <div className='bg-white rounded-xl shadow px-6 py-8'>
            <ReservationForm onSuccess={handleReservationSuccess} />
          </div>
        )}
        {activeTab === "status" && (
          <div className='bg-white rounded-xl shadow px-6 py-8'>
            {/* isAdmin={true}로 기본 설정 (필요 시 props로 넘길 수 있음) */}
            <ReservationStatus isAdmin={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTabs;
