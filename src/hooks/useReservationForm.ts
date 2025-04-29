"use client";

import { useState, useEffect } from "react";
import type { ReservationFormData } from "../types/reservation"
const emptyForm: ReservationFormData = {
  teamName: "",
  tutor: "",
  timeSlot: "",
  resourceLink: "",
  question: "",
  editPassword: "",
};

const useReservationForm = () => {
  const [form, setForm] = useState<ReservationFormData>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationFormData, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reservationForm");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch (e) {
        console.error("폼 상태 복구 실패", e);
      }
    }
  }, [submitted]);

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem("reservationForm", JSON.stringify(form));
    }
  }, [form, submitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "tutor") {
      setForm((prev) => ({ ...prev, tutor: value, timeSlot: "" }));
    }

    if (errors[name as keyof ReservationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const selectTimeSlot = (slot: string) => {
    setForm((prev) => ({ ...prev, timeSlot: slot }));
    if (errors.timeSlot) {
      setErrors((prev) => ({ ...prev, timeSlot: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;

    if (!form.teamName.trim()) newErrors.teamName = "팀명을 입력해주세요";
    if (!form.tutor) newErrors.tutor = "튜터를 선택해주세요";
    if (!form.timeSlot) newErrors.timeSlot = "시간대를 선택해주세요";
    if (!form.resourceLink.trim() || !urlPattern.test(form.resourceLink))
      newErrors.resourceLink =
        "유효한 링크를 입력해주세요 (http 또는 https로 시작)";
    if (!form.question.trim()) newErrors.question = "질문 내용을 입력해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setForm(emptyForm);
    localStorage.setItem("reservationForm", JSON.stringify(emptyForm));
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    submitted,
    setSubmitted,
    handleChange,
    selectTimeSlot,
    validate,
    reset,
  };
};

export default useReservationForm;
