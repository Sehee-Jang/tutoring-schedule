import React from "react";
import type { Reservation } from "@/types/reservation";
import { useAvailability } from "../../context/AvailabilityContext";
import { useReservations } from "../../context/ReservationContext";
import ModalLayout from "../shared/ModalLayout";
import PrimaryButton from "../shared/PrimaryButton";
import TimeSlotButton from "../shared/TimeSlotButton";
import useReservationEditor from "../../hooks/useReservationEditor";
import sortTimeSlots from "../../utils/sortTimeSlots";

interface ReservationDetailModalProps {
  isOpen: boolean;
  reservation: Reservation | null;
  onClose: () => void;
}

const ReservationDetailModal = ({
  isOpen,
  reservation,
  onClose,
}: ReservationDetailModalProps) => {
  const { availability } = useAvailability();
  const { reservations } = useReservations();

  const { form, setForm, editMode, setEditMode, handleChange, update } =
    useReservationEditor(reservation, onClose);

  if (!isOpen || !reservation) return null;

  const bookedTimeSlots = reservations
    .filter(
      (r: Reservation) =>
        r.tutor === reservation.tutor && r.id !== reservation.id
    )
    .map((r: Reservation) => r.timeSlot);

  const availableSlots = sortTimeSlots(
    (availability[reservation.tutor] || []).filter(
      (slot: string) => !bookedTimeSlots.includes(slot)
    )
  );

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-bold text-gray-800 mb-4'>예약 상세 정보</h2>

      <div className='space-y-4 text-sm text-gray-700'>
        <p>
          <strong>조 이름:</strong> {reservation.teamName}
        </p>

        <p>
          <strong>튜터:</strong> {reservation.tutor}
        </p>

        <div>
          <strong>질문:</strong>
          {editMode ? (
            <textarea
              name='question'
              value={form.question}
              onChange={handleChange}
              className='w-full border p-2 rounded mt-1 text-sm overflow-y-auto'
            />
          ) : (
            <div className='mt-1 max-h-32 overflow-y-auto p-2 bg-gray-50 border rounded text-sm whitespace-pre-wrap'>
              {form.question}
            </div>
          )}
        </div>

        <div>
          <strong>관련 링크 (피그마, 노션 등): </strong>
          {editMode ? (
            <input
              type='text'
              name='resourceLink'
              value={form.resourceLink}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded mt-1 text-sm'
            />
          ) : (
            <a
              href={form.resourceLink}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline break-all mt-1 inline-block'
            >
              {form.resourceLink}
            </a>
          )}
        </div>

        <div>
          <strong>예약 시간:</strong>
          {editMode ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
              {availableSlots.map((slot) => {
                const [hour, min] = slot.split("-")[0].split(":").map(Number);
                const slotStart = hour * 60 + min;

                const now = new Date();
                const nowMinutes = now.getHours() * 60 + now.getMinutes();

                const isPast = slotStart < nowMinutes; // 현재 시각 이전만 비활성화

                return (
                  <TimeSlotButton
                    key={slot}
                    active={form.timeSlot === slot}
                    disabled={isPast} // 관리자도 과거시간은 비활성화
                    onClick={() =>
                      !isPast &&
                      setForm((prev) => ({ ...prev, timeSlot: slot }))
                    }
                  >
                    {slot}
                  </TimeSlotButton>
                );
              })}
            </div>
          ) : (
            <p className='mt-1'>{form.timeSlot}</p>
          )}
        </div>
      </div>

      <div className='flex justify-center gap-4 mt-6'>
        {editMode ? (
          <>
            <PrimaryButton onClick={update}>저장</PrimaryButton>
            <button
              onClick={() => setEditMode(false)}
              className='text-sm text-gray-500 hover:underline'
            >
              취소
            </button>
          </>
        ) : (
          <PrimaryButton onClick={() => setEditMode(true)}>수정</PrimaryButton>
        )}
      </div>
    </ModalLayout>
  );
};

export default ReservationDetailModal;
