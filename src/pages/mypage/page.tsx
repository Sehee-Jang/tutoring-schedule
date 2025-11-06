"use client";

export default function MyPage() {
  return (
    <div className='page-wrap py-6'>
      <section className='text-center mt-2 mb-4'>
        <h1 className='text-[28px] leading-tight font-bold text-neutral-900'>
          내 강의실
        </h1>
        <p className='text-sm text-neutral-500 mt-2'>
          예약 내역과 알림, 프로필 정보를 관리하세요.
        </p>
      </section>

      <div className='bg-white rounded-2xl border border-[hsl(var(--border))] shadow-sm p-6 md:p-8'>
        {/* TODO: 마이페이지 실제 콘텐츠로 교체 */}
        <p className='text-neutral-600'>준비 중입니다.</p>
      </div>
    </div>
  );
}
