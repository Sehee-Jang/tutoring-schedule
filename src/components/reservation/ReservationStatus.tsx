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

  const filtered = useMemo(() => {
    return activeTab === "all"
      ? reservations
      : reservations.filter((r: Reservation) => r.tutor === activeTab);
  }, [reservations, activeTab]);

  const handleCancel = async (id: string) => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      try {
        await cancelReservation(id);
        toast.success("✅ 예약이 성공적으로 취소되었습니다!");
      } catch {
        toast.error("❌ 예약 취소 중 오류가 발생했습니다.");
      }
    }
  };

  const displayedReservations = filtered.slice(0, visibleCount);

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
      {loading ? (
        // 로딩 중
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500' />
        </div>
      ) : filtered.length ? (
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
          {filtered.length > visibleCount && (
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
      )}

      {/* 예약 상세 모달 */}
      <ReservationDetailModal
        isOpen={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default ReservationStatus;
