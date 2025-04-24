import React, { useState, useEffect } from "react";
import { useReservations } from "../../context/ReservationContext";
import { createReservation } from "../../services/firebase";
import { useAvailability } from "../../context/AvailabilityContext";
import PrimaryButton from "../shared/PrimaryButton";
import TimeSlotButton from "../shared/TimeSlotButton";
import TutorButton from "../shared/TutorButton";

const ReservationForm = () => {
  const { isTimeSlotBooked } = useReservations();
  const [formData, setFormData] = useState({
    teamName: "",
    tutor: "",
    timeSlot: "",
    figmaLink: "",
    question: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { availability } = useAvailability();

  const tutors = Object.keys(availability);

  useEffect(() => {
    const savedForm = localStorage.getItem("reservationForm");
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (e) {
        console.error("폼 상태 복구 실패", e);
      }
    }
  }, [submitted]);

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem("reservationForm", JSON.stringify(formData));
    }
  }, [formData, submitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "tutor")
      setFormData((prev) => ({ ...prev, tutor: value, timeSlot: "" }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setFormData((prev) => ({ ...prev, timeSlot }));
    if (errors.timeSlot) setErrors((prev) => ({ ...prev, timeSlot: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamName.trim()) newErrors.teamName = "팀명을 입력해주세요";
    if (!formData.tutor) newErrors.tutor = "튜터를 선택해주세요";
    if (!formData.timeSlot) newErrors.timeSlot = "시간대를 선택해주세요";
    if (
      !formData.figmaLink.trim() ||
      !formData.figmaLink.includes("figma.com")
    ) {
      newErrors.figmaLink = "유효한 피그마 링크를 입력해주세요";
    }
    if (!formData.question.trim())
      newErrors.question = "질문 내용을 입력해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createReservation(formData);
      console.log("✅ 예약 성공");

      // 초기화
      const empty = {
        teamName: "",
        tutor: "",
        timeSlot: "",
        figmaLink: "",
        question: "",
      };
      setFormData(empty);
      localStorage.setItem("reservationForm", JSON.stringify(empty));

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
                selected={formData.tutor === tutor}
                onClick={() =>
                  handleInputChange({ target: { name: "tutor", value: tutor } })
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

        {formData.tutor && (
          <div>
            <h3 className='font-semibold text-gray-700 mb-2'>시간 선택</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {(availability[formData.tutor] || []).map((slot) => {
                const isBooked = isTimeSlotBooked(formData.tutor, slot);
                return (
                  <TimeSlotButton
                    key={slot}
                    disabled={isBooked}
                    active={formData.timeSlot === slot}
                    onClick={() => !isBooked && handleTimeSlotSelect(slot)}
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
            value={formData.teamName}
            onChange={handleInputChange}
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
            value={formData.figmaLink}
            onChange={handleInputChange}
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
            value={formData.question}
            onChange={handleInputChange}
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
