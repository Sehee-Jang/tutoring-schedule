import React, { useState } from "react";
import type { Reservation } from "../../../types/reservation";
import { MoreVertical } from "lucide-react";
import ReservationDetailModal from "../../../components/reservations/ReservationDetailModal";
import { useToast } from "../../../hooks/use-toast";
import { cancelReservation } from "../../../services/reservations";

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const [expanded, setExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleCancel = async (id: string) => {
    if (window.confirm("예약을 취소하시겠습니까?")) {
      try {
        await cancelReservation(id);
        toast({
          title: "예약이 성공적으로 취소되었습니다!",
          variant: "default",
        });
        setIsMenuOpen(false);
      } catch {
        toast({
          title: "❌ 예약 취소 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className='bg-blue-50 p-3 rounded-md border border-[#E0E7FF] cursor-pointer hover:bg-blue-100 transition relative'
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className='flex items-center justify-between'>
        <p className='font-semibold'>{reservation.teamName}</p>
        {/* <span className='text-gray-500 text-xs'>{reservation.timeSlot}</span> */}

        {/* 더보기 버튼 */}
        <button
          onClick={toggleMenu}
          className='text-gray-500 hover:text-gray-800'
        >
          <MoreVertical className='w-5 h-5' />
        </button>
      </div>
      <p className='text-sm text-blue-600 mt-1'>
        <a
          href={reservation.resourceLink}
          target='_blank'
          rel='noopener noreferrer'
        >
          {reservation.resourceLink}
        </a>
      </p>

      {expanded && (
        <div className='mt-2 text-sm text-gray-700 max-h-8 overflow-y-auto'>
          <p>{reservation.question}</p>
        </div>
      )}

      {/* 더보기 메뉴 */}
      {isMenuOpen && (
        <div className='absolute right-2 top-8 bg-white shadow-md rounded-md border border-gray-200 z-50 p-2'>
          <button
            className='block text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 w-full text-left'
            onClick={openModal}
          >
            보기
          </button>
          <button
            className='block text-sm text-red-600 hover:bg-red-50 px-4 py-2 w-full text-left'
            onClick={() => handleCancel(reservation.id)}
          >
            삭제
          </button>
        </div>
      )}

      {/* 예약 상세 모달 */}
      {isModalOpen && (
        <ReservationDetailModal
          isOpen={isModalOpen}
          reservation={reservation}
          onClose={closeModal}
          isAdmin={true} // 관리자 권한
        />
      )}
    </div>
  );
};

export default ReservationCard;
