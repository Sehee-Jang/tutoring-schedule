import React, { useState, useEffect } from "react";
import { useReservations } from "../context/ReservationContext";
import { createReservation } from "../services/firebase";

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

  const tutorSchedules = {
    남궁찬양: [
      "10:00-10:30",
      "10:30-11:00",
      "11:00-11:30",
      "11:30-12:00",
      "12:00-12:30",
      "12:30-13:00",
    ],
    오은화: [
      "10:00-10:30",
      "10:30-11:00",
      "11:00-11:30",
      "11:30-12:00",
      "12:00-12:30",
      "12:30-13:00",
      "14:00-14:30",
      "14:30-15:00",
    ],
    정기식: [
      "10:00-10:30",
      "10:30-11:00",
      "11:00-11:30",
      "11:30-12:00",
      "12:00-12:30",
      "12:30-13:00",
      "14:00-14:30",
      "14:30-15:00",
      "15:00-15:30",
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
      "17:00-17:30",
      "17:30-18:00",
    ],
    박소연: [
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
      "17:00-17:30",
      "17:30-18:00",
      "19:00-19:30",
      "19:30-20:00",
      "20:00-20:30",
      "20:30-21:00",
    ],
    김다희: [
      "15:00-15:30",
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
      "17:00-17:30",
      "17:30-18:00",
      "19:00-19:30",
      "19:30-20:00",
      "20:00-20:30",
      "20:30-21:00",
    ],
    홍윤정: [
      "12:00-12:30",
      "12:30-13:00",
      "14:00-14:30",
      "14:30-15:00",
      "15:00-15:30",
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
      "17:00-17:30",
      "17:30-18:00",
      "19:00-19:30",
      "19:30-20:00",
      "20:00-20:30",
      "20:30-21:00",
    ],
    김훈: ["19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00"],
    송조해: ["19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00"],
    김수진: ["19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00"],
  };

  const tutors = Object.keys(tutorSchedules);

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
              <button
                key={tutor}
                type='button'
                onClick={() =>
                  handleInputChange({ target: { name: "tutor", value: tutor } })
                }
                className={`rounded-lg border px-4 py-2 font-medium text-sm ${
                  formData.tutor === tutor
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tutor}
              </button>
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
              {tutorSchedules[formData.tutor].map((slot) => {
                const isBooked = isTimeSlotBooked(formData.tutor, slot);
                return (
                  <button
                    key={slot}
                    type='button'
                    disabled={isBooked}
                    onClick={() => !isBooked && handleTimeSlotSelect(slot)}
                    className={`rounded-lg border px-4 py-2 text-sm ${
                      formData.timeSlot === slot
                        ? "bg-blue-600 text-white"
                        : isBooked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {slot} {isBooked && "(예약됨)"}
                  </button>
                );
              })}
            </div>
            {errors.timeSlot && (
              <p className='text-red-500 text-sm mt-1'>{errors.timeSlot}</p>
            )}
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

        <button
          type='submit'
          className='bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 px-4 rounded'
        >
          예약하기
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
