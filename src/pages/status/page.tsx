"use client";

import ReservationStatus from "../../components/reservations/ReservationStatus";

export default function ReservationStatusPage() {
  return (
    <div className='page-wrap py-6'>
      <section className='text-center mt-2 mb-4'>
        <h1 className='text-[28px] leading-tight font-bold text-neutral-900'>
          실시간 예약 현황
        </h1>
        <p className='text-sm text-neutral-500 mt-2'>
          실시간으로 업데이트되는 튜터들의 예약 가능 시간을 확인하세요.
        </p>
      </section>

      <div className='bg-white rounded-2xl border border-[hsl(var(--border))] shadow-sm p-6 md:p-8'>
        <ReservationStatus />
      </div>
    </div>
  );
}
