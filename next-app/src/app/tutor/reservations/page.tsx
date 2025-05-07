"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import ReservationStatus from "@/components/reservations/ReservationStatus";

const ReservationPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <h2 className='text-2xl font-bold text-gray-800'>
          로그인 후 이용 가능한 서비스입니다.
        </h2>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>실시간 예약 확인</h2>
      <ReservationStatus />
    </div>
  );
};

export default ReservationPage;
