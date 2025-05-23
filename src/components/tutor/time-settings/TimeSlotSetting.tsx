"use client";

import { useEffect, useState, useCallback } from "react";
import TimeSlotButton from "../../shared/TimeSlotButton";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/use-toast";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";
import {
  fetchAvailableSlotsByDate,
  saveAvailability,
} from "../../../services/availability";
import { ChevronDown } from "lucide-react";
import Button from "../../shared/Button";

const TimeSlotSetting = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("월요일");
  const [availability, setAvailability] = useState<string[]>([]);
  const [startTime] = useState<string>("09:00");
  const [endTime] = useState<string>("21:00");
  const [interval] = useState<number>(30);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // 저장 버튼 핸들러
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

  // 일괄 저장 버튼 핸들러
  const handleApplyToAll = () => {
    if (!user) return;

    const otherDays = [
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    otherDays.forEach(async (day) => {
      await saveAvailability(
        user.id,
        day,
        startTime,
        endTime,
        interval,
        availability
      );
    });

    toast({
      title: "다른 요일에도 동일하게 적용되었습니다",
      variant: "default",
    });
  };

  return (
    <div className='space-y-6'>
      {/* 요일 탭 */}
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

      {/* 시간 설정 */}
      {/* <div className='flex justify-between items-center mt-4 px-6'>
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
          </div>
        </div> */}

      {/* 시간 버튼 */}
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

      {/* 저장 버튼 */}
      <div className='flex justify-end relative inline-block text-left'>
        <Button
          variant='primary'
          className='text-sm flex items-center'
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <ChevronDown className="w-4 h-4" /> 저장 옵션
        </Button>
        {/* <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm'
        >
        <ChevronDown className="w-4 h-4" />저장 옵션
        </button> */}
        {dropdownOpen && (
          <div className='absolute right-0 mt-10 w-40 bg-white shadow-md rounded border'>
            <button
              className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              onClick={handleSave}
            >
              현재 요일 저장
            </button>
            <button
              className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              onClick={handleApplyToAll}
            >
              모든 요일에 저장
            </button>
          </div>
        )}
      </div>
      {/* <div className='flex justify-end'>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm'
        >
          설정 저장
        </button>
      </div> */}
    </div>
  );
};

export default TimeSlotSetting;
