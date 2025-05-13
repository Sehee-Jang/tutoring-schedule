"use client";

import { useEffect, useState, useCallback } from "react";
import TimeSlotButton from "../../../components/shared/TimeSlotButton";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/use-toast";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";
import {
  fetchAvailableSlotsByDate,
  saveAvailability,
} from "../../../services/availability";

const TimeSlotSetting = () => {
  const { user, isTutor } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("월요일");
  const [availability, setAvailability] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("21:00");
  const [interval, setInterval] = useState<number>(30);
  const { toast } = useToast();

  const slots = generateTimeSlots(startTime, endTime, interval);

  // 저장된 시간대 불러오기
  const loadSavedAvailability = useCallback(async () => {
    if (!user) return;

    const fetchedSlots = await fetchAvailableSlotsByDate(user.id, selectedDay);

    const activeSlots = fetchedSlots[0]?.activeSlots || [];

    setAvailability(activeSlots);
  }, [user, selectedDay]);

  useEffect(() => {
    if (user) loadSavedAvailability();
  }, [user, selectedDay, loadSavedAvailability]);

  // 시간대 토글
  const toggleSlot = (slot: string) => {
    setAvailability((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // 저장 함수
  const handleSave = async () => {
    if (!user || availability.length === 0) return;

    await saveAvailability(
      user.id,
      selectedDay,
      startTime,
      endTime,
      interval,
      availability
    );

    // 성공
    toast({
      title: "튜터링 시간 설정 성공",
      variant: "default",
    });
    loadSavedAvailability(); // 저장 후 다시 로드하여 활성화 반영
  };

  return (
    <div className='p-4 bg-white rounded-lg shadow-md space-y-4'>
      <h2 className='text-xl font-semibold'>튜터링 가능 시간 설정</h2>

      <div className='space-y-4'>
        <div className='flex w-full items-center justify-between border-b'>
          {[
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
            "일요일",
          ].map((day) => (
            <button
              key={day}
              className={`flex-1 text-center px-3 py-2 ${
                selectedDay === day
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className='flex justify-between items-center mt-4 px-6'>
          <div className='flex items-center space-x-4'>
            <label>시간 설정:</label>
            <input
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className='border px-2 py-1 rounded'
            />
            <span>~</span>
            <input
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className='border px-2 py-1 rounded'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <label>간격(분):</label>
            <input
              type='number'
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              min='5'
              max='120'
              step='5'
              className='border px-2 py-1 rounded w-20'
            />

            <button
              onClick={handleSave}
              className='bg-blue-600 text-white px-4 py-2 rounded'
            >
              설정 저장
            </button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-6 gap-2 mt-4'>
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
    </div>
  );
};

export default TimeSlotSetting;
