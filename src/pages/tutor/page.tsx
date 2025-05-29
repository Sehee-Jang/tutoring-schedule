"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TutorReservationProvider } from "../../context/ReservationContext";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import TutorLayout from "./TutorLayout";
import TimeSettingsPanel from "../../components/tutor/time-settings/TimeSettingsPanel";
import ReservationStatusForTutor from "../../components/tutor/reservation/ReservationStatusForTutor";

const TutorPage = () => {
  const { user } = useAuth();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"timeSettings" | "reservations">(
    "reservations"
  );
  const [date, setDate] = useState(new Date());
  const selectedDateString = format(date, "yyyy-MM-dd");


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
              onClick={() => navigate("/")}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
            >
              ← 메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole='tutor'>
      <TutorReservationProvider selectedDate={selectedDateString}>
        <TutorLayout setViewMode={setViewMode} viewMode={viewMode}>
          {viewMode === "reservations" ? (
            <ReservationStatusForTutor date={date} setDate={setDate} />
          ) : (
            <TimeSettingsPanel />
          )}
        </TutorLayout>
      </TutorReservationProvider>
    </ProtectedRoute>
  );
};

export default TutorPage;
