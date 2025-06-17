"use client";

import React, { useEffect, useState } from "react";
import type { Reservation, ReservationFormData } from "../../types/reservation";
import { useReservations } from "../../context/ReservationContext";
import { fetchAvailableSlotsByDate } from "../../services/availability";
import { createReservation } from "../../services/reservations";
import { useTutors } from "../../context/TutorContext";
import { useToast } from "../../hooks/use-toast";
import { useHolidayContext } from "../../context/HolidayContext";
import { isHoliday } from "../../utils/dateUtils";
import { format } from "date-fns";
import Button from "../../components/shared/Button";
import TimeSlotButton from "../../components/shared/TimeSlotButton";
import TutorButton from "../../components/shared/TutorButton";
import ReservationGuideModal from "./ReservationGuideModal";
import useReservationForm from "../../hooks/useReservationForm";
import { sendEmailAlert } from "../../utils/sendEmailAlert";
import sortTimeSlots from "../../utils/sortTimeSlots";
import { useAuth } from "../../context/AuthContext";
import { getDayOfWeek } from "../../utils/getDayOfWeek";

interface ReservationFormProps {
  onSuccess?: () => void;
}

const ReservationForm = ({ onSuccess }: ReservationFormProps) => {
  const { isTimeSlotBooked } = useReservations();
  const { tutors } = useTutors();
  const { toast } = useToast();
  const { holidays } = useHolidayContext();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [tutorID, setTutorID] = useState<string>("");
  const [showGuide, setShowGuide] = useState(false);
  const [isTutorOnHoliday, setIsTutorOnHoliday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const todayString = format(new Date(), "yyyy-MM-dd");
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

  // 로그인 사용자 이름을 teamName 기본값으로 설정
  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({
        ...prev,
        teamName: prev.teamName || user.name, // 사용자가 이미 수정한 값이 있으면 덮어쓰지 않음
      }));
    }
  }, [user?.name, setForm]);

  // 사용자가 튜터를 선택할 때마다 시간대 로드
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!tutorID) return;

      // 휴무일 확인
      const tutorHolidays = holidays[tutorID] || [];
      const isHolidayToday = isHoliday(todayString, tutorHolidays);
      setIsTutorOnHoliday(isHolidayToday);

      if (isHolidayToday) {
        setAvailableSlots([]);
        return;
      }
      // 오늘의 요일 계산 (예: "월요일", "화요일")
      const today = new Date();

      const todayDayOfWeek = getDayOfWeek(today);

      // 선택된 튜터의 가능한 시간 불러오기
      const slots = await fetchAvailableSlotsByDate(tutorID, todayDayOfWeek);

      const flatSlots = slots.flatMap((item) => item.activeSlots);
      const sortedFilteredSlots = sortTimeSlots(flatSlots).filter((slot) => {
        const [hour, min] = slot.split("-")[0].split(":").map(Number);
        const slotStart = hour * 60 + min;
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return slotStart > nowMinutes + 30;
      });

      setAvailableSlots(sortedFilteredSlots);
    };

    loadAvailableSlots();
  }, [tutorID, holidays, todayString]);

  // 튜터 선택 핸들러
  const handleTutorSelect = (tutorName: string) => {
    setForm((prev) => ({ ...prev, tutor: tutorName, timeSlot: "" }));
    const selected = tutors.find((tutor) => tutor.name === tutorName);
    setTutorID(selected?.id || "");
  };

  // 예약 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 로그인된 사용자 정보 가져오기 (유저 ID)
      const userId = user?.id || "";

      // Reservation 객체 생성 (필수 필드 추가)
      const reservationData: Omit<Reservation, "id" | "createdAt"> = {
        ...form,
        userId: userId,
        date: todayString,
        classDate: todayString,
        status: "reserved", // 기본값: 예약 상태
      };

      await createReservation(reservationData);

      // 이메일 알림 발송
      await sendEmailAlert(form as ReservationFormData);

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
    } catch (err) {
      alert("예약 중 오류가 발생했습니다.");
      console.error("Error: ", err);
      // 실패
      toast({
        title: "❌ 예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // 예약 끝
    }
  };

  return (
    <>
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
        ※ 당일에만 예약 가능합니다. (오늘: {todayString})
      </p>

      {submitted && (
        <div className='bg-green-50 border border-green-300 text-green-600 p-4 rounded mb-4'>
          성공적으로 예약되었습니다!
        </div>
      )}

      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        {/* 튜터 선택 */}
        <div>
          <h3 className='font-semibold text-gray-700 mb-2'>튜터 선택</h3>
          <div className='grid grid-cols-3 sm:grid-cols-3 gap-2'>
            {tutors.map((tutor) => (
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

        {/* 시간 선택 */}
        <div>
          <h3 className='font-semibold text-gray-700 mb-2'>시간 선택</h3>
          {isTutorOnHoliday ? (
            <div className='text-red-500 text-center text-sm py-8'>
              오늘은 해당 튜터의 휴무일입니다. 예약이 불가능합니다.
            </div>
          ) : availableSlots.length === 0 ? (
            <p className='text-gray-400'>예약 가능한 시간이 없습니다.</p>
          ) : (
            <div className='grid grid-cols-3 gap-2 mt-2'>
              {availableSlots.map((slot) => {
                const isBooked = isTimeSlotBooked(form.tutor!, slot);
                return (
                  <TimeSlotButton
                    key={slot}
                    disabled={isBooked}
                    active={form.timeSlot === slot}
                    onClick={() => !isBooked && selectTimeSlot(slot)}
                  >
                    {slot}
                    {isBooked && "(예약됨)"}
                  </TimeSlotButton>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className='block font-medium text-gray-700 mb-1'>
            예약자 (조이름)
          </label>
          <input
            name='teamName'
            value={form.teamName}
            onChange={handleChange}
            placeholder='예: A1조 or 홍길동'
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

        <Button type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? "예약 중..." : "예약하기"}
        </Button>
      </form>

      {/* 예약 가이드 모달 */}
      {showGuide && (
        <ReservationGuideModal onClose={() => setShowGuide(false)} />
      )}
    </>
  );
};

export default ReservationForm;
