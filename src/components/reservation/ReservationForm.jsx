import React from "react";
import { useReservations } from "../../context/ReservationContext";
import { createReservation } from "../../services/firebase";
import { useAvailability } from "../../context/AvailabilityContext";
import PrimaryButton from "../shared/PrimaryButton";
import TimeSlotButton from "../shared/TimeSlotButton";
import TutorButton from "../shared/TutorButton";
import useReservationForm from "../../hooks/useReservationForm";
import { sendEmailAlert } from "../../utils/sendEmailAlert";

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
      <h2 className='text-xl font-semibold text-blue-700 mb-2'>
        튜터링 예약하기
      </h2>
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
              {(availability[form.tutor] || []).map((slot) => {
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
            피그마 파일 링크
          </label>
          <input
            name='figmaLink'
            type='url'
            value={form.figmaLink}
            onChange={handleChange}
            placeholder='https://www.figma.com/...'
            className='w-full border rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300'
          />
          {errors.figmaLink && (
            <p className='text-red-500 text-sm mt-1'>{errors.figmaLink}</p>
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
    </div>
  );
};

export default ReservationForm;
