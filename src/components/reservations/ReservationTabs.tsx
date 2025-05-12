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
    <div className='max-w-5xl mx-auto p-4'>
      <div className='bg-white rounded-xl shadow px-6 py-8'>
        {/* 탭 버튼 */}
        <div className='bg-gray-50 p-2 rounded-xl flex justify-center gap-2 mb-6'>
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
              <ReservationStatus />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationTabs;
