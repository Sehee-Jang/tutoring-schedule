"use client";

import React, { useState } from "react";
import type { ReservationFormData } from "../../types/reservation";
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
import { useTutors } from "../../context/TutorContext";
import { useToast } from "../../hooks/use-toast";

interface ReservationFormProps {
  onSuccess?: () => void;
}

const ReservationForm = ({ onSuccess }: ReservationFormProps) => {
  const { isTimeSlotBooked } = useReservations();
  const { availability } = useAvailability();
  const { tutors } = useTutors();
  const { toast } = useToast();

  const {
    form,
    errors,
    submitted,
    setSubmitted,
    handleChange,
    selectTimeSlot,
    validate,
    reset,
    setForm,
  } = useReservationForm();

  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReservation(form as ReservationFormData);
      await sendEmailAlert(form as ReservationFormData); // 이메일 전송

      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);

      // 성공
      toast({
        title: "예약이 성공적으로 완료되었습니다!",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess(); // 추가: 성공하면 탭 이동
      }
    } catch (error) {
      alert("예약 중 오류가 발생했습니다.");
      // 실패
      toast({
        title: "❌ 예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleTutorSelect = (tutorName: string) => {
    setForm((prev) => ({ ...prev, tutor: tutorName, timeSlot: "" }));
  };

  return (
    <div>
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
          <div className='grid grid-cols-3 sm:grid-cols-3 gap-2'>
            {tutors.length === 0
              ? [...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    className='animate-pulse bg-gray-200 h-10 rounded'
                  ></div>
                ))
              : tutors.map((tutor) => (
                  <TutorButton
                    key={tutor.id}
                    selected={form.tutor === tutor.name}
                    onClick={() => handleTutorSelect(tutor.name)}
                  >
                    {tutor.name}
                  </TutorButton>
                ))}
          </div>
          {errors.tutor && (
            <p className='text-red-500 text-sm mt-1'>{errors.tutor}</p>
          )}
        </div>

        <div>
          <h3 className='font-semibold text-gray-700 mb-2'>시간 선택</h3>

          <div className='max-h-[100px] min-h-[100px] overflow-y-scroll pr-1 rounded'>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {(() => {
                if (!form.tutor) {
                  return (
                    <div className='col-span-3 w-full bg-gray-100 text-gray-400 text-center py-8 rounded'>
                      먼저 튜터를 선택해 주세요.
                    </div>
                  );
                }

                const availableSlots = sortTimeSlots(
                  availability[form.tutor] || []
                ).filter((slot) => {
                  const [hour, min] = slot.split("-")[0].split(":").map(Number);
                  const slotStart = hour * 60 + min;

                  const now = new Date();
                  const nowMinutes = now.getHours() * 60 + now.getMinutes();

                  return slotStart > nowMinutes + 30;
                });

                if (availableSlots.length === 0) {
                  return (
                    <div className='col-span-3 text-gray-400 text-center py-8'>
                      예약 가능한 시간이 없습니다.
                    </div>
                  );
                }

                return availableSlots.map((slot) => {
                  const isBooked = isTimeSlotBooked(form.tutor!, slot);

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
                });
              })()}
            </div>
          </div>
        </div>

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

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            비밀번호
          </label>
          <input
            name='editPassword'
            type='password'
            value={form.editPassword || ""}
            onChange={handleChange}
            placeholder='예약 수정 시, 사용할 비밀번호를 입력해주세요.'
            className='w-full border rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300'
          />
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
