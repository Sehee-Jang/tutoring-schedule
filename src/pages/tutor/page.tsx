"use client";

import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import { Settings } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import ReservationDetailModal from "../../components/reservations/ReservationDetailModal";
import AvailabilityModal from "../../components/availability/AvailabilityModal";
import ReservationCard from "../../components/reservations/ReservationCard";
import PrimaryButton from "../../components/shared/PrimaryButton";

const TutorPage = () => {
  const { user } = useAuth();
  const { reservations } = useReservations();
  const { modalType, modalProps, closeModal, showModal } = useModal();

  // 로그인 안 되어있을 때
  if (!user) {
    return (
      <div className='p-8 text-center'>
        <p className='text-lg'>튜터링 서비스를 이용하려면 로그인해주세요.</p>
        <button
          onClick={() => showModal("login")}
          className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700'
        >
          로그인
        </button>
      </div>
    );
  }

  // 튜터가 아닐 때
  if (user.role !== "tutor") {
    return (
      <div className='p-8 text-center'>
        <p className='text-lg'>이 페이지는 튜터 전용입니다.</p>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>
          {user.name} 튜터님, 안녕하세요 👋
        </h1>
        <button
          onClick={() => showModal("availability")}
          title='튜터링 가능 시간 설정'
          className='text-gray-700 hover:text-black'
        >
          <Settings className='w-5 h-5' />
        </button>
      </div>

      <section>
        <h2 className='text-xl font-semibold mb-4'>오늘 예약 현황</h2>
        {reservations.length === 0 ? (
          <p className='text-gray-500'>오늘 예약이 없습니다.</p>
        ) : (
          <ul className='space-y-4'>
            {reservations.map((res) => (
              <ReservationCard key={res.id} reservation={res} />
            ))}
          </ul>
        )}
      </section>

      {/* 모달 렌더링 */}
      {modalType === "reservationDetail" && (
        <ReservationDetailModal
          isOpen={true}
          reservation={modalProps?.reservation || null}
          onClose={closeModal}
          isAdmin={false} // 튜터 페이지니까 false
        />
      )}

      {modalType === "availability" && (
        <AvailabilityModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default TutorPage;
