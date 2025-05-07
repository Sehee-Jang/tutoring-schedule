"use client";

import { useEffect, useState } from "react";
import { updateReservation } from "@/services/firebase";
import type {
  Reservation,
  ReservationEditorFormData,
} from "@/types/reservation";
import { useToast } from "./use-toast";
import { sendEmailAlert } from "@/utils/sendEmailAlert";

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
  const { toast } = useToast();

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
      toast({
        title: "수정할 예약이 없습니다.",
        variant: "default",
      });
      return;
    }

    try {
      await updateReservation(reservation.id, form);

      // 이메일 발송 실패는 UI 영향 없이 별도 처리
      try {
        await sendEmailAlert({
          teamName: reservation.teamName,
          tutor: reservation.tutor,
          timeSlot: form.timeSlot,
          resourceLink: form.resourceLink,
          question: form.question,
          isUpdate: true,
        });
      } catch (emailError) {
        console.warn("📭 이메일 발송 실패 (예약은 성공):", emailError);
      }

      toast({
        title: "수정 되었습니다!",
        variant: "default",
      });
      setEditMode(false);
      onClose();
    } catch {
      toast({
        title: "수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
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
