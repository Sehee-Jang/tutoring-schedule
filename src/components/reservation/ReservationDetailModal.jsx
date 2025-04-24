import React, { useState, useEffect } from "react";
import { updateReservation } from "../../services/firebase";
import { useAvailability } from "../../context/AvailabilityContext";
import { useReservations } from "../../context/ReservationContext";
import ModalLayout from "../shared/ModalLayout";

const ReservationDetailModal = ({ isOpen, reservation, onClose }) => {
  const { availability } = useAvailability();
  const { reservations } = useReservations();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    question: "",
    figmaLink: "",
    timeSlot: "",
  });

  useEffect(() => {
    if (reservation) {
      setForm({
        question: reservation.question || "",
        figmaLink: reservation.figmaLink || "",
        timeSlot: reservation.timeSlot || "",
      });
    }
  }, [reservation]);

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false); // 모달 닫힐 때 수정모드 초기화
    }
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  const bookedTimeSlots = reservations
    .filter((r) => r.tutor === reservation.tutor && r.id !== reservation.id)
    .map((r) => r.timeSlot);

  const availableSlots = (availability[reservation.tutor] || []).filter(
    (slot) => !bookedTimeSlots.includes(slot)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateReservation(reservation.id, form);
      alert("수정 완료!");
      setEditMode(false);
      onClose();
    } catch {
      alert("수정 실패 😢");
    }
  };

  return (
    <ModalLayout onClose={onClose}>
      {/* 모달 내용 */}

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
          <strong>피그마 링크:</strong>
          {editMode ? (
            <input
              type='text'
              name='figmaLink'
              value={form.figmaLink}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded mt-1 text-sm'
            />
          ) : (
            <a
              href={form.figmaLink}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline break-all mt-1 inline-block'
            >
              {form.figmaLink}
            </a>
          )}
        </div>

        <div>
          <strong>예약 시간:</strong>
          {editMode ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type='button'
                  onClick={() =>
                    setForm((prev) => ({ ...prev, timeSlot: slot }))
                  }
                  className={`px-3 py-2 text-sm rounded border ${
                    form.timeSlot === slot
                      ? "bg-[#262626] text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className='mt-1'>{form.timeSlot}</p>
          )}
        </div>
      </div>

      {/* 수정 or 저장 버튼 */}
      <div className='flex justify-center gap-4 mt-6'>
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              className='bg-[#262626] text-white px-4 py-2 rounded text-sm'
            >
              저장
            </button>
            <button
              onClick={() => setEditMode(false)}
              className='text-sm text-gray-500 hover:underline'
            >
              취소
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className='bg-[#262626] text-white px-4 py-2 rounded text-sm'
          >
            수정
          </button>
        )}
      </div>
    </ModalLayout>
  );
};

export default ReservationDetailModal;
