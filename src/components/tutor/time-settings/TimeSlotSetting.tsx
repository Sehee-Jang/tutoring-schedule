"use client";

import { useEffect, useState, useCallback } from "react";
import DayTabs from "./DayTabs";
import SaveDropdown from "./SaveDropdown";
import TimeSlotButton from "../../shared/TimeSlotButton";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/use-toast";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";
import {
  fetchAvailableSlotsByDate,
  saveAvailability,
} from "../../../services/availability";
import { DAYS_OF_WEEK } from "../../../constants/days";

const TimeSlotSetting = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("월요일");
  const [availability, setAvailability] = useState<string[]>([]);
  const [startTime] = useState<string>("09:00");
  const [endTime] = useState<string>("21:00");
  const [interval] = useState<number>(30);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
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

      await loadSavedAvailability(); // 저장 후 다시 로드하여 활성화 반영
    } catch (error) {
      console.error("❌ 저장 오류:", error);
      toast({
        title: "저장 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 일괄 저장 버튼 핸들러
  const handleApplyToAll = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      for (const day of DAYS_OF_WEEK) {
        await saveAvailability(
          user.id,
          day,
          startTime,
          endTime,
          interval,
          availability
        );
      }

      toast({
        title: "다른 요일에도 동일하게 적용되었습니다",
        variant: "default",
      });

      await loadSavedAvailability();
    } catch (error) {
      console.error("❌ 일괄 저장 오류:", error);
      toast({
        title: "일괄 저장 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* 요일 탭 */}
      <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />

      {/* 시간 설정 */}
      {/* <TimeRangeControls
        startTime={startTime}
        endTime={endTime}
        interval={interval}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onIntervalChange={setInterval}
      /> */}

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
      <SaveDropdown
        open={dropdownOpen}
        onToggle={() => setDropdownOpen(!dropdownOpen)}
        onSaveCurrent={handleSave}
        onSaveAll={handleApplyToAll}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TimeSlotSetting;
