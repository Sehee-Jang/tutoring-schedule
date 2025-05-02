"use client";

import { useState, useMemo } from "react";
import type { Reservation } from "../../types/reservation";
import { useReservations } from "../../context/ReservationContext";
import { useAuth } from "../../context/AuthContext";
import { cancelReservation } from "../../services/firebase";
import ReservationDetailModal from "./ReservationDetailModal";
import { useToast } from "../../hooks/use-toast";
import PasswordModal from "./PasswordModal";
import TutorScheduleTable from "./TutorScheduleTable";
import FutureReservationTable from "./FutureReservationTable";
import PastReservationTable from "./PastReservationTable";
import ReservationTabsHeader from "./ReservationTabsHeader";

const ReservationStatus = () => {
  const { isAdmin, isTutor } = useAuth();
  const { reservations, loading } = useReservations();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [futureVisibleCount, setFutureVisibleCount] = useState(10);
  const [pastVisibleCount, setPastVisibleCount] = useState(10);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingReservation, setPendingReservation] =
    useState<Reservation | null>(null);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const { toast } = useToast();

  // 예약 시간 순으로 정렬
  const sortedReservations = useMemo(() => {
    const base =
      activeTab === "all"
        ? reservations
        : reservations.filter((r: Reservation) => r.tutor === activeTab);

    return [...base].sort((a, b) => {
      const [aHour, aMin] = a.timeSlot.split("-")[0].split(":").map(Number);
      const [bHour, bMin] = b.timeSlot.split("-")[0].split(":").map(Number);

      const aTotalMinutes = aHour * 60 + aMin;
      const bTotalMinutes = bHour * 60 + bMin;

      return aTotalMinutes - bTotalMinutes;
    });
  }, [reservations, activeTab]);

  const futureReservations = sortedReservations.filter((res) => {
    const [hour, min] = res.timeSlot.split("-")[0].split(":").map(Number);
    const reservationStartMinutes = hour * 60 + min;
    return reservationStartMinutes > nowMinutes;
  });

  const pastReservations = sortedReservations.filter((res) => {
    const [hour, min] = res.timeSlot.split("-")[0].split(":").map(Number);
    const reservationStartMinutes = hour * 60 + min;
    return reservationStartMinutes <= nowMinutes;
  });

  const handleCancel = async (id: string) => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      try {
        await cancelReservation(id);
        toast({
          title: "예약이 성공적으로 취소되었습니다!",
          variant: "default",
        });
      } catch {
        toast({
          title: "❌ 예약 취소 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  // 보기 버튼
  const handleViewClick = (reservation: Reservation) => {
    if (isAdmin) {
      setSelectedReservation(reservation); // 관리자는 바로 상세 모달
    } else {
      setPendingReservation(reservation); // 비관리자는 비번 입력
      setPasswordModalOpen(true);
    }
  };

  // 비밀번호 입력 버튼
  const handlePasswordSubmit = (inputPassword: string) => {
    if (
      pendingReservation &&
      inputPassword === pendingReservation.editPassword
    ) {
      setSelectedReservation(pendingReservation);
      setPasswordModalOpen(false);
    } else {
      toast({
        title: "❌ 비밀번호가 틀렸습니다.",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <h2 className='text-xl font-semibold text-blue-700 mb-6'>
        실시간 예약 현황
      </h2>

      {/* 탭 선택 */}
      <ReservationTabsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservations={reservations}
      />

      {loading ? (
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500' />
        </div>
      ) : activeTab !== "all" ? (
        <TutorScheduleTable
          tutorName={activeTab}
          isAdmin={isAdmin}
          isTutor={isTutor}
          onView={handleViewClick}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {/* 진행 예정 예약 */}
          <h3 className='text-lg font-semibold text-gray-700 mb-4 mt-8'>
            진행 예정 예약
          </h3>
          <FutureReservationTable
            reservations={futureReservations}
            visibleCount={futureVisibleCount}
            onLoadMore={() => setFutureVisibleCount((prev) => prev + 10)}
            onView={handleViewClick}
            onCancel={handleCancel}
            isAdmin={isAdmin}

          />

          {/* 지난 예약 */}
          <h3 className='text-lg font-semibold text-gray-700 mb-4 mt-12'>
            지난 예약
          </h3>
          <PastReservationTable
            reservations={pastReservations}
            visibleCount={pastVisibleCount}
            onLoadMore={() => setPastVisibleCount((prev) => prev + 10)}
            onView={(res) => setSelectedReservation(res)}
            onCancel={handleCancel}
            isAdmin={isAdmin}
          />
        </>
      )}
      {/* 예약 상세 모달 */}
      <ReservationDetailModal
        isOpen={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        isAdmin={isAdmin}
      />

      {/* 비밀번호 모달 */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={handlePasswordSubmit}
      />
    </div>
  );
};

export default ReservationStatus;
