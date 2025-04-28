"use client";

import React, { useEffect, useState } from "react";
import { useAvailability } from "../../context/AvailabilityContext";
import ModalLayout from "../shared/ModalLayout";
import TimeSlotButton from "../shared/TimeSlotButton";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour < 21; hour++) {
    slots.push(
      `${String(hour).padStart(2, "0")}:00-${String(hour).padStart(2, "0")}:30`
    );
    slots.push(
      `${String(hour).padStart(2, "0")}:30-${String(hour + 1).padStart(
        2,
        "0"
      )}:00`
    );
  }
  return slots;
};

const tutors: string[] = [
  "오은화",
  "김다희",
  "박소연",
  "정기식",
  "남궁찬양",
  "김훈",
  "홍윤정",
  "김수진",
  "송조해",
];

const AvailabilityModal = ({ isOpen, onClose }: AvailabilityModalProps) => {
  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const [selectedTutor, setSelectedTutor] = useState<string>(tutors[0]);
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  ); // { 튜터이름: ["시간대", ...] }
  const slots = generateTimeSlots();

  // 모달 열릴 때 Firestore에서 불러온 시간대 상태로 복사
  useEffect(() => {
    if (isOpen) {
      setAvailability(globalAvailability);
    }
  }, [isOpen, globalAvailability]);

  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      const current = prev[selectedTutor] || [];
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [selectedTutor]: updated };
    });
  };

  const handleSave = async () => {
    await updateAvailability(selectedTutor, availability[selectedTutor] || []);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-bold mb-4 text-blue-800'>
        튜터 가능 시간 설정
      </h2>

      {/* 튜터 선택 */}
      <div className='mb-4'>
        <label className='font-semibold text-sm text-gray-600 mr-2'>
          튜터 선택:
        </label>
        <select
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          className='border px-3 py-1 rounded'
        >
          {tutors.map((tutor) => (
            <option key={tutor} value={tutor}>
              {tutor}
            </option>
          ))}
        </select>
      </div>

      {/* 시간 선택 */}
      <div className='grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm text-gray-700 mb-4 max-h-64 overflow-y-auto'>
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot}
            active={availability[selectedTutor]?.includes(slot)}
            disabled={false}
            onClick={() => toggleSlot(slot)}
          >
            {slot}
          </TimeSlotButton>
        ))}
      </div>

      {/* 저장/닫기 버튼 */}
      <div className='flex justify-end gap-2'>
        <button
          onClick={onClose}
          className='text-gray-600 hover:underline text-sm'
        >
          닫기
        </button>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-4 py-2 rounded text-sm'
        >
          저장
        </button>
      </div>
    </ModalLayout>
  );
};

export default AvailabilityModal;
