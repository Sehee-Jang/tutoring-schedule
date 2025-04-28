"use client";

import { useEffect, useState } from "react";
import { updateReservation } from "../services/firebase";
import type {
  Reservation,
  ReservationEditorFormData,
} from "../types/reservation";

const useReservationEditor = (
  reservation: Reservation | null,
  onClose: () => void
) => {
  const [form, setForm] = useState<ReservationEditorFormData>({
    question: "",
    resourceLink: "",
    timeSlot: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (reservation) {
      setForm({
        question: reservation.question || "",
        resourceLink: reservation.resourceLink || "",
        timeSlot: reservation.timeSlot || "",
      });
    }
  }, [reservation]);

  useEffect(() => {
    if (!reservation) {
      setEditMode(false); // 예약이 없으면 수정모드도 초기화
    }
  }, [reservation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const update = async () => {
    if (!reservation) {
      alert("수정할 예약이 없습니다.");
      return;
    }

    try {
      await updateReservation(reservation.id, form);
      alert("수정 완료!");
      setEditMode(false);
      onClose();
    } catch {
      alert("수정 실패 😢");
    }
  };

  return {
    form,
    setForm,
    editMode,
    setEditMode,
    handleChange,
    update,
  };
};

export default useReservationEditor;
