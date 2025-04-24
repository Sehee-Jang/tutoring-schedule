import ReservationDetailModal from "./ReservationDetailModal";
import React, { useState } from "react";
import { useReservations } from "../context/ReservationContext";
import { cancelReservation } from "../services/firebase";

const ReservationStatus = ({ isAdmin }) => {
  const { reservations, loading } = useReservations();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const tutors = [
    "오은화",
    "김다희",
    "박소연",
    "정기식",
    "남궁찬양",
    "김훈",
    "홍윤정",
    "김수진",
    "송조해",
  ];

  const filtered =
    activeTab === "all"
      ? reservations
      : reservations.filter((r) => r.tutor === activeTab);

  const handleCancel = async (id) => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      try {
        await cancelReservation(id);
      } catch {
        alert("오류 발생");
      }
    }
  };

  return (
    <div className='bg-white rounded-xl shadow px-6 py-8 mb-8'>
      <h2 className='text-xl font-semibold text-blue-700 mb-6'>
        실시간 예약 현황
      </h2>

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
          const count = reservations.filter((r) => r.tutor === tutor).length;
          return (
            <button
              key={tutor}
              onClick={() => setActiveTab(tutor)}
              className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                activeTab === tutor
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {tutor} <span className='text-xs font-bold'>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 테이블 */}
      {filtered.length ? (
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
            {filtered.map((res) => (
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
      ) : (
        <p className='text-center text-gray-500 py-6'>
          예약된 튜터링이 없습니다.
        </p>
      )}
      <ReservationDetailModal
        isOpen={!!selectedReservation}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default ReservationStatus;
