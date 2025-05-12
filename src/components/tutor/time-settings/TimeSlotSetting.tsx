"use client";

import { useEffect, useState, useCallback } from "react";
import TimeSlotButton from "../../../components/shared/TimeSlotButton";
import { useTutors } from "../../../context/TutorContext";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "../../../hooks/use-toast";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";
import {
  deleteAvailabilityById,
  fetchAvailableSlotsByDate,
  saveAvailability,
} from "../../../services/availability";
import { format } from "date-fns";

interface SlotData {
  id: string;
  repeatType: "none" | "daily" | "weekly" | "monthly";
  repeatDays: string[];
  slots: string[];
}

const TimeSlotSetting = () => {
  const { tutors } = useTutors();
  const { user, isAdmin, isTutor } = useAuth();
  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [savedAvailability, setSavedAvailability] = useState<SlotData[]>([]);
  const [repeatType, setRepeatType] = useState<
    "none" | "daily" | "weekly" | "monthly"
  >("none");
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const slots = generateTimeSlots(9, 21);

  // 튜터 초기 설정
  useEffect(() => {
    if (isTutor && user?.name) {
      setSelectedTutor(user.name);
    } else if (isAdmin && tutors.length > 0 && !selectedTutor) {
      setSelectedTutor(tutors[0].name);
    }
  }, [isTutor, isAdmin, user, tutors, selectedTutor]);

  const loadSavedAvailability = useCallback(async () => {
    if (!selectedTutor) return;

    const selectedTutorId = tutors.find(
      (tutor) => tutor.name === selectedTutor
    )?.id;
    if (!selectedTutorId) return;

    const todayString = format(new Date(), "yyyy-MM-dd");
    const fetchedSlots = await fetchAvailableSlotsByDate(
      selectedTutorId,
      todayString
    );

    const typedSlots: SlotData[] = fetchedSlots.map((slot) => ({
      id: slot.id,
      repeatType:
        (slot.repeatType as "none" | "daily" | "weekly" | "monthly") ?? "none",
      repeatDays: slot.repeatDays || [],
      slots: slot.slots,
    }));

    setSavedAvailability(typedSlots);
  }, [selectedTutor, tutors]);

  // 저장된 시간대 불러오기
  useEffect(() => {
    if (selectedTutor) {
      loadSavedAvailability();
    }
  }, [selectedTutor, loadSavedAvailability]);

  // 시간대 토글
  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      return prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot];
    });
  };

  // 저장 함수
  const handleSave = async () => {
    try {
      if (!selectedTutor || availability.length === 0 || !startDate) {
        toast({
          title: "❌ 필수 정보를 모두 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      const selectedTutorId = tutors.find(
        (tutor) => tutor.name === selectedTutor
      )?.id;
      if (!selectedTutorId) {
        toast({
          title: "❌ 튜터 ID를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      await saveAvailability(
        selectedTutorId,
        repeatType,
        repeatDays,
        startDate,
        endDate || startDate,
        availability
      );

      toast({ title: "✅ 가능 시간이 저장되었습니다." });
      loadSavedAvailability(); // 저장 후 새로고침
    } catch (err) {
      console.error("Error: ", err);
      toast({ title: "❌ 저장에 실패했습니다.", variant: "destructive" });
    }
  };

  // 저장된 시간대 삭제
  const handleDelete = async (index: number) => {
    const toDelete = savedAvailability[index];
    if (!toDelete || !toDelete.id) return;

    try {
      await deleteAvailabilityById(toDelete.id);

      // UI에서 즉시 삭제 반영
      const updated = savedAvailability.filter((_, i) => i !== index);
      setSavedAvailability(updated);
      toast({ title: "시간대가 삭제되었습니다." });
    } catch (err) {
      console.error("Error: ", err);
      toast({
        title: "❌ 시간대 삭제에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
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
      <div className='mb-4'>
        <label>시작일:</label>
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='border px-2 py-1 rounded'
        />
        <label className='ml-4'>종료일 (선택):</label>
        <input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='border px-2 py-1 rounded'
        />
      </div>
      <div className='mb-4'>
        <label>반복 설정:</label>
        <select
          value={repeatType}
          onChange={(e) =>
            setRepeatType(
              e.target.value as "none" | "daily" | "weekly" | "monthly"
            )
          }
          className='border px-2 py-1 rounded'
        >
          <option value='none'>반복 없음</option>
          <option value='daily'>매일</option>
          <option value='weekly'>매주</option>
          <option value='monthly'>매월</option>
        </select>
        {repeatType === "weekly" && (
          <div>
            <label>반복 요일:</label>
            <input
              type='text'
              value={repeatDays.join(", ")}
              onChange={(e) =>
                setRepeatDays(
                  e.target.value.split(",").map((day) => day.trim())
                )
              }
              placeholder='월, 화, 수'
              className='border px-2 py-1 rounded mt-2'
            />
          </div>
        )}
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot}
            active={availability.includes(slot)}
            onClick={() => toggleSlot(slot)}
            disabled={false}
          >
            {slot}
          </TimeSlotButton>
        ))}
      </div>
      <div className='flex justify-end mt-2'>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700'
        >
          저장
        </button>
      </div>

      {/* 현재 설정된 시간대 */}
      <h3 className='text-lg font-semibold mt-6'>현재 설정된 시간대</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3'>
        {savedAvailability.length > 0 ? (
          savedAvailability.map((slotData, index) => (
            <div
              key={index}
              className='relative p-3 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col space-y-1'
            >
              <div className='flex items-center justify-between'>
                <p className='font-medium text-gray-700'>
                  반복:{" "}
                  {slotData.repeatType === "none"
                    ? "없음"
                    : slotData.repeatType}
                </p>
                <button
                  onClick={() => handleDelete(index)}
                  className='text-red-600 hover:text-red-800 absolute top-2 right-2'
                  title='삭제'
                >
                  🗑️
                </button>
              </div>
              {slotData.repeatType === "weekly" &&
                slotData.repeatDays.length > 0 && (
                  <p className='text-sm text-gray-500'>
                    반복 요일: {slotData.repeatDays.join(", ")}
                  </p>
                )}
              <div className='flex flex-wrap gap-2 mt-2'>
                {slotData.slots.map((timeSlot: string, idx: number) => (
                  <span
                    key={idx}
                    className='px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md'
                  >
                    {timeSlot}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>저장된 시간대가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSetting;
