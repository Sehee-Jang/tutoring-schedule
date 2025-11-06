import ReservationForm from "../../components/reservations/ReservationForm";

const ReservationPage = () => {
  return (
    <div className='page-wrap py-6'>
      {/* 타이틀 */}
      <section className='text-center mt-2 mb-4'>
        <h1 className='text-[28px] leading-tight font-bold text-neutral-900'>
          튜터링 예약하기
        </h1>
        <p className='text-sm text-neutral-500 mt-2'>
          튜터와 시간대를 선택하고 문의 내용을 간단히 남겨주세요.
        </p>
      </section>

      {/* 콘텐츠 카드 */}
      <div className='bg-white rounded-2xl border border-[hsl(var(--border))] shadow-sm p-6 md:p-8 '>
        <ReservationForm onSuccess={() => (window.location.href = "/status")} />
      </div>
    </div>
  );
};

export default ReservationPage;
