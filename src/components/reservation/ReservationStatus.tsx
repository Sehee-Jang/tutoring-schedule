"use client";

import { useState, useMemo } from "react";
import type { Reservation } from "../../types/reservation";
import { useReservations } from "../../context/ReservationContext";
import { cancelReservation } from "../../services/firebase";
import ReservationDetailModal from "./ReservationDetailModal";
import TutorButton from "../shared/TutorButton";
import { useTutors } from "../../context/TutorContext";
import { toast } from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import PasswordModal from "./PasswordModal";

interface ReservationStatusProps {
  isAdmin: boolean;
}
const ReservationStatus = ({ isAdmin }: ReservationStatusProps) => {
  const { reservations, loading } = useReservations();
  const { tutors } = useTutors();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [futureVisibleCount, setFutureVisibleCount] = useState(10);
  const [pastVisibleCount, setPastVisibleCount] = useState(10);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingReservation, setPendingReservation] =
    useState<Reservation | null>(null);

  const now = new Date();
  const todayString = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

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

  const displayedReservations = sortedReservations.slice(0, visibleCount);

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
        toast.success("예약이 성공적으로 취소되었습니다!");
      } catch {
        toast.error("예약 취소 중 오류가 발생했습니다.");
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
      alert("비밀번호가 틀렸습니다.");
    }
  };
  return (
    <div>
      <h2 className='text-xl font-semibold text-blue-700 mb-6'>
        실시간 예약 현황
      </h2>

      {/* 탭 선택 */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          전체 예약
        </button>
        {tutors.map((tutor) => {
          const count = reservations.filter(
            (r: Reservation) => r.tutor === tutor.name
          ).length;
          return (
            <TutorButton
              key={tutor.id}
              selected={activeTab === tutor.name}
              onClick={() => setActiveTab(tutor.name)}
            >
              {tutor.name} <span className='text-xs font-bold'>{count}</span>
            </TutorButton>
          );
        })}
      </div>

      {/* 테이블 */}
      {/* {loading ? (
        // 로딩 중
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500' />
        </div>
      ) : sortedReservations.length ? (
        <>
          <table className='w-full text-sm border border-gray-200 rounded overflow-hidden'>
            <thead>
              <tr className='bg-blue-50 text-blue-800 text-left'>
                <th className='px-4 py-2 border'>튜터명</th>
                <th className='px-4 py-2 border'>시간</th>
                <th className='px-4 py-2 border'>예약자</th>
                {isAdmin && <th className='px-4 py-2 border'>관리</th>}
              </tr>
            </thead>
            <tbody>
              {displayedReservations.map((res: Reservation) => (
                <tr key={res.id} className='even:bg-gray-50'>
                  <td className='px-4 py-2 border'>{res.tutor}</td>
                  <td className='px-4 py-2 border'>{res.timeSlot}</td>
                  <td className='px-4 py-2 border'>{res.teamName}</td>
                  {isAdmin && (
                    <td className='px-4 py-2 border'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => setSelectedReservation(res)}
                          className='bg-blue-500 text-white px-3 py-1 rounded text-xs'
                        >
                          보기
                        </button>
                        <button
                          onClick={() => handleCancel(res.id)}
                          className='bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-xs'
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {sortedReservations.length > visibleCount && (
            <div className='w-full flex justify-center mt-6'>
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className='flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm font-semibold transition'
              >
                <ChevronDown className='w-4 h-4' />
                더보기
              </button>
            </div>
          )}
        </>
      ) : (
        <p className='text-center text-gray-500 py-6'>
          예약된 튜터링이 없습니다.
        </p>
      )} */}

      {loading ? (
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500' />
        </div>
      ) : (
        <>
          {/* 진행 예정 예약 */}
          <h3 className='text-lg font-semibold text-gray-700 mb-4 mt-8'>
            진행 예정 예약
          </h3>
          {futureReservations.length > 0 ? (
            <>
              <table className='w-full text-sm border border-gray-200 rounded overflow-hidden'>
                <thead>
                  <tr className='bg-blue-50 text-blue-800 text-left'>
                    <th className='px-4 py-2 border'>튜터명</th>
                    <th className='px-4 py-2 border'>시간</th>
                    <th className='px-4 py-2 border'>예약자</th>
                    <th className='px-4 py-2 border'>보기</th>
                  </tr>
                </thead>
                <tbody>
                  {futureReservations
                    .slice(0, futureVisibleCount)
                    .map((res: Reservation) => (
                      <tr key={res.id} className='even:bg-gray-50'>
                        <td className='px-4 py-2 border'>{res.tutor}</td>
                        <td className='px-4 py-2 border'>{res.timeSlot}</td>
                        <td className='px-4 py-2 border'>{res.teamName}</td>
                        <td className='px-4 py-2 border'>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleViewClick(res)}
                              className='bg-blue-500 text-white px-3 py-1 rounded text-xs'
                            >
                              보기
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleCancel(res.id)}
                                className='bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-xs'
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {futureReservations.length > futureVisibleCount && (
                <div className='flex justify-center mt-6'>
                  <button
                    onClick={() => setFutureVisibleCount((prev) => prev + 10)}
                    className='flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm font-semibold transition'
                  >
                    <ChevronDown className='w-4 h-4' />
                    더보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className='text-center text-gray-400 py-6'>
              진행 예정 예약이 없습니다.
            </p>
          )}
          {/* 지난 예약 */}
          <h3 className='text-lg font-semibold text-gray-700 mb-4 mt-12'>
            지난 예약
          </h3>
          {pastReservations.length > 0 ? (
            <>
              <table className='w-full text-sm border border-gray-200 rounded overflow-hidden'>
                <thead>
                  <tr className='bg-blue-50 text-blue-800 text-left'>
                    <th className='px-4 py-2 border'>튜터명</th>
                    <th className='px-4 py-2 border'>시간</th>
                    <th className='px-4 py-2 border'>예약자</th>
                    {isAdmin && <th className='px-4 py-2 border'>관리</th>}
                  </tr>
                </thead>
                <tbody>
                  {pastReservations
                    .slice(0, pastVisibleCount)
                    .map((res: Reservation) => (
                      <tr key={res.id} className='even:bg-gray-50'>
                        <td className='px-4 py-2 border'>{res.tutor}</td>
                        <td className='px-4 py-2 border'>{res.timeSlot}</td>
                        <td className='px-4 py-2 border'>{res.teamName}</td>
                        {isAdmin && (
                          <td className='px-4 py-2 border'>
                            <div className='flex gap-2'>
                              <button
                                onClick={() => setSelectedReservation(res)}
                                className='bg-blue-500 text-white px-3 py-1 rounded text-xs'
                              >
                                보기
                              </button>
                              <button
                                onClick={() => handleCancel(res.id)}
                                className='bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-xs'
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
              {pastReservations.length > pastVisibleCount && (
                <div className='flex justify-center mt-6'>
                  <button
                    onClick={() => setPastVisibleCount((prev) => prev + 10)}
                    className='flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm font-semibold transition'
                  >
                    <ChevronDown className='w-4 h-4' />
                    더보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className='text-center text-gray-400 py-6'>
              지난 예약이 없습니다.
            </p>
          )}
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
