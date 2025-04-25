import React, { useState } from "react";
import { useReservations } from "../../context/ReservationContext";
import { createReservation } from "../../services/firebase";
import { useAvailability } from "../../context/AvailabilityContext";
import { sendEmailAlert } from "../../utils/sendEmailAlert";
import useReservationForm from "../../hooks/useReservationForm";

import PrimaryButton from "../shared/PrimaryButton";
import TimeSlotButton from "../shared/TimeSlotButton";
import TutorButton from "../shared/TutorButton";
import ReservationGuideModal from "./ReservationGuideModal";
import sortTimeSlots from "../../utils/sortTimeSlots";

const ReservationForm = () => {
  const { isTimeSlotBooked } = useReservations();
  const { availability } = useAvailability();
  const tutors = Object.keys(availability);

  const {
    form,
    errors,
    submitted,
    setSubmitted,
    handleChange,
    selectTimeSlot,
    validate,
    reset,
  } = useReservationForm();

  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReservation(form);
      await sendEmailAlert(form); // 이메일 전송
      console.log("✅ 예약 및 이메일 전송 성공");
      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("예약 중 오류가 발생했습니다.");
      console.error("❌ 예약 실패:", error);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow px-6 py-8'>
      <div className='flex items-center mb-4'>
        <h2 className='text-xl font-semibold text-blue-700 mr-2'>
          튜터링 예약하기
        </h2>
        <button
          onClick={() => setShowGuide(true)}
          className='text-sm text-blue-500 underline hover:text-blue-700'
        >
          가이드
        </button>
      </div>

      <p className='text-sm text-gray-500 mb-6'>
        ※ 당일에만 예약 가능합니다. (오늘:{" "}
        {new Date().toISOString().split("T")[0]})
      </p>

      {submitted && (
        <div className='bg-green-50 border border-green-300 text-green-600 p-4 rounded mb-4'>
          성공적으로 예약되었습니다!
        </div>
      )}

      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        <div>
          <h3 className='font-semibold text-gray-700 mb-2'>튜터 선택</h3>
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
            {tutors.map((tutor) => (
              <TutorButton
                key={tutor}
                selected={form.tutor === tutor}
                onClick={() =>
                  handleChange({ target: { name: "tutor", value: tutor } })
                }
              >
                {tutor}
              </TutorButton>
            ))}
          </div>
          {errors.tutor && (
            <p className='text-red-500 text-sm mt-1'>{errors.tutor}</p>
          )}
        </div>

        {form.tutor && (
          <div>
            <h3 className='font-semibold text-gray-700 mb-2'>시간 선택</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {sortTimeSlots(availability[form.tutor] || [])
                .filter((slot) => {
                  const [hour, min] = slot.split("-")[0].split(":").map(Number);
                  const slotStart = hour * 60 + min;

                  const now = new Date();
                  const nowMinutes = now.getHours() * 60 + now.getMinutes();

                  return slotStart > nowMinutes + 30; // 현재로부터 30분 이후만 표시
                })
                .map((slot) => {
                  const isBooked = isTimeSlotBooked(form.tutor, slot);

                  return (
                    <TimeSlotButton
                      key={slot}
                      disabled={isBooked}
                      active={form.timeSlot === slot}
                      onClick={() => !isBooked && selectTimeSlot(slot)}
                    >
                      {slot} {isBooked && "(예약됨)"}
                    </TimeSlotButton>
                  );
                })}
            </div>
          </div>
        )}

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            예약자 (조이름)
          </label>
          <input
            name='teamName'
            value={form.teamName}
            onChange={handleChange}
            placeholder='예: A1조'
            className='w-full border rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300'
          />
          {errors.teamName && (
            <p className='text-red-500 text-sm mt-1'>{errors.teamName}</p>
          )}
        </div>

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            관련 링크 (피그마, 노션 등)
          </label>
          <input
            name='resourceLink'
            type='url'
            value={form.resourceLink}
            onChange={handleChange}
            placeholder='https://'
            className='w-full border rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300'
          />
          {errors.resourceLink && (
            <p className='text-red-500 text-sm mt-1'>{errors.resourceLink}</p>
          )}
        </div>

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            질문 내용
          </label>
          <textarea
            name='question'
            value={form.question}
            onChange={handleChange}
            rows={4}
            placeholder='튜터님에게 궁금한 내용을 입력해주세요.'
            className='w-full border rounded px-4 py-2 text-sm resize-y focus:ring-2 focus:ring-blue-300'
          />
          {errors.question && (
            <p className='text-red-500 text-sm mt-1'>{errors.question}</p>
          )}
        </div>

        <PrimaryButton type='submit'>예약하기</PrimaryButton>
      </form>

      {/* 예약 가이드 모달 */}
      {showGuide && (
        <ReservationGuideModal onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
};

export default ReservationForm;
