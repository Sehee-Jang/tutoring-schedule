"use client";

import React, { useEffect, useState } from "react";
import TimeSlotButton from "@/components/shared/TimeSlotButton";
import { useAvailability } from "@/context/AvailabilityContext";
import { useTutors } from "@/context/TutorContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { generateTimeSlots } from "@/utils/generateTimeSlots";

const TimeSlotSetting = () => {
  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const { tutors } = useTutors();
  const { user, isAdmin, isTutor } = useAuth();

  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );
  const slots = generateTimeSlots();

  // 튜터 초기 설정
  useEffect(() => {
    if (isTutor && user?.name) {
      setSelectedTutor(user.name);
    } else if (isAdmin && tutors.length > 0 && !selectedTutor) {
      setSelectedTutor(tutors[0].name);
    }
  }, [isTutor, isAdmin, user, tutors, selectedTutor]);

  // 초기 availability 복사
  useEffect(() => {
    setAvailability(globalAvailability);
  }, [globalAvailability]);

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
    try {
      await updateAvailability(
        selectedTutor,
        availability[selectedTutor] || []
      );
      toast({ title: "✅ 가능 시간이 저장되었습니다." });
    } catch (err) {
      toast({ title: "❌ 저장에 실패했습니다.", variant: "destructive" });
    }
  };

  return (
    // <div className='flex flex-wrap gap-2 text-gray-700 '>
    //   {timeSlots.map((slot) => (
    //     <TimeSlotButton
    //       key={slot}
    //       active={selected.includes(slot)}
    //       disabled={disabledSlots.includes(slot)}
    //       onClick={() => toggleSlot(slot)}
    //     >
    //       {slot}
    //     </TimeSlotButton>
    //   ))}
    // </div>
    <div>
      {isAdmin && (
        <div className='mb-4'>
          <label className='text-sm text-gray-600 font-medium mr-2'>
            튜터 선택:
          </label>
          <select
            value={selectedTutor}
            onChange={(e) => setSelectedTutor(e.target.value)}
            className='border px-3 py-1 rounded'
          >
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.name}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='flex flex-wrap gap-2 text-gray-700'>
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot}
            active={availability[selectedTutor]?.includes(slot)}
            onClick={() => toggleSlot(slot)}
            disabled={false}
          >
            {slot}
          </TimeSlotButton>
        ))}
      </div>

      <div className='flex justify-end'>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700'
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default TimeSlotSetting;
