"use client";

import { useAuth } from "../../context/AuthContext";
import { useReservations } from "../../context/ReservationContext";
import { useModal } from "../../context/ModalContext";
import { Settings, LogOut } from "lucide-react";
import TutorScheduleTable from "../../components/reservations/TutorScheduleTable";
import ReservationDetailModal from "../../components/reservations/ReservationDetailModal";
import AvailabilityModal from "../../components/availability/AvailabilityModal";
import type { Reservation } from "../../types/reservation";
import { logout } from "../../services/auth";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigate } from "react-router-dom";

const TutorPage = () => {
  const { user, isAdmin, isTutor } = useAuth();
  const { reservations } = useReservations();
  const { modalType, modalProps, closeModal, showModal } = useModal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleView = (reservation: Reservation) => {
    showModal("reservationDetail", {
      reservation,
      isAdmin,
      isTutor,
    });
  };

  return (
    <ProtectedRoute requiredRole='tutor'>
      <div className='p-6 max-w-3xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>
            {user!.name} 튜터님, 안녕하세요 👋
          </h1>

          <button
            onClick={handleLogout}
            title='로그아웃'
            className='text-gray-700 hover:text-black'
          >
            <LogOut className='w-5 h-5' />
          </button>
        </div>

        {/* 오늘 예약 현황 */}
        <section className='relative'>
          <h2 className='text-xl font-semibold mb-4'>오늘 예약 현황</h2>

          {/* 시간 설정 버튼 */}
          <button
            onClick={() => showModal("availability")}
            title='튜터링 가능 시간 설정'
            className='absolute right-0 top-0 text-sm text-gray-700 hover:text-black'
          >
            <Settings className='w-5 h-5' />
          </button>

          {/* 오늘 예약 현황 테이블 */}
          <TutorScheduleTable
            tutorName={user!.name}
            isAdmin={isAdmin}
            onView={handleView}
          />
        </section>

        {/* 모달 렌더링 */}
        {modalType === "reservationDetail" && (
          <ReservationDetailModal
            isOpen={true}
            reservation={modalProps?.reservation || null}
            onClose={closeModal}
            isAdmin={false} // 튜터 페이지니까 false
            isTutor={modalProps?.isTutor || false}
          />
        )}

        {modalType === "availability" && <AvailabilityModal />}
      </div>
    </ProtectedRoute>
  );
};

export default TutorPage;
