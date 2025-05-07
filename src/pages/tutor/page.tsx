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
import { useRouter } from "next/router";
import { cancelReservation } from "../../services/firebase";
import { useToast } from "../../hooks/use-toast";
import Header from "@/components/tutor/Header";
import TutorLayout from "./TutorLayout";
import TimeSettingsPanel from "./TimeSettingsPanel";

const TutorPage = () => {
  const { user, isAdmin, isTutor } = useAuth();
  const { reservations } = useReservations();
  const { modalType, modalProps, closeModal, showModal } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  // user === null이면 로그인 하도록 유도
  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='p-10 text-center space-y-6 bg-white rounded-xl shadow max-w-md w-full'>
          <h2 className='text-2xl font-bold text-gray-800'>
            로그인 후 이용 가능한 서비스입니다.
          </h2>
          <div className='flex justify-center gap-4'>
            <button
              onClick={() => showModal("login")}
              className='bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700'
            >
              로그인
            </button>
            <button
              onClick={() => showModal("signup")}
              className='border border-blue-600 text-blue-600 px-5 py-2 rounded-md text-sm hover:bg-blue-50'
            >
              회원가입
            </button>
          </div>
          <div className='pt-4'>
            <button
              onClick={() => router.push("/")}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
            >
              ← 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleView = (reservation: Reservation) => {
    showModal("reservationDetail", {
      reservation,
      isAdmin,
      isTutor,
    });
  };

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

  return (
    // <ProtectedRoute requiredRole='tutor'>
    <TutorLayout>
      <TimeSettingsPanel />
    </TutorLayout>
    // </ProtectedRoute>
  );
};

export default TutorPage;
