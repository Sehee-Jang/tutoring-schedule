import { useEffect, useState } from "react";
import { updateReservation } from "../services/firebase";

const useReservationEditor = (reservation, onClose) => {
  const [form, setForm] = useState({
    question: "",
    figmaLink: "",
    timeSlot: "",
  });
  const [editMode, setEditMode] = useState(false);

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
    if (!reservation) {
      setEditMode(false); // 예약이 없으면 수정모드도 초기화
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const update = async () => {
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
