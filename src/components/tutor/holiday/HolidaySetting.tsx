"use client";

import { useEffect, useState } from "react";
import {
  fetchTutorHolidays,
  saveTutorHoliday,
  deleteTutorHoliday,
} from "../../../services/holiday";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "../../../hooks/use-toast";
import { Holiday } from "../../../types/tutor";
import HolidayForm from "./HolidayForm";
import HolidayTable from "./HolidayTable";

const HolidaySetting = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const data = await fetchTutorHolidays(user.id);
        setHolidays(data);
      } catch {
        console.error("휴무일 불러오기 오류:", Error);
        toast({
          description: "휴무일을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const addHoliday = async () => {
    if (!startDate || !reason) return;
    if (!user?.id) return;

    try {
      const id = await saveTutorHoliday(user.id, startDate, endDate, reason);
      setHolidays((prev) => [
        ...prev,
        {
          id,
          tutorID: user.id,
          startDate,
          endDate,
          reason,
        },
      ]);
      setStartDate("");
      setEndDate("");
      setReason("");
      toast({ title: "휴무일이 추가되었습니다.", variant: "default" });
    } catch (error) {
      console.error("휴무일 추가 오류:", error);
      toast({
        description: "휴무일 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const deleteHoliday = async (id: string) => {
    if (!user?.id) return;
    try {
      await deleteTutorHoliday(id);
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      toast({ title: "휴무일이 삭제되었습니다.", variant: "default" });
    } catch (error) {
      console.error("휴무일 삭제 오류:", error);
      toast({
        description: "휴무일 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // handleSave 함수
  const handleSave = async () => {
    if (!user?.id) return;
    try {
      // 1. 기존 휴무일 삭제 (Firebase)
      for (const holiday of holidays) {
        await deleteTutorHoliday(holiday.id);
      }

      // 2. 새로운 휴무일 추가
      for (const { startDate, endDate, reason } of holidays) {
        await saveTutorHoliday(user.id, startDate, endDate, reason);
      }

      toast({
        description: "휴무일이 저장되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("휴무일 저장 실패:", error);
      toast({
        description: "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p>휴무일 데이터를 불러오는 중입니다...</p>;

  return (
    <div className='space-y-6'>
      {/* 입력 영역 */}
      <HolidayForm
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        reason={reason}
        setReason={setReason}
        addHoliday={addHoliday}
        isDateInvalid={!!(endDate && startDate > endDate)}
      />
      {/* 테이블 */}
      <HolidayTable
        holidays={holidays}
        formatDate={formatDate}
        deleteHoliday={deleteHoliday}
      />
      {/* 저장 버튼 */}
      <div className='flex justify-end'>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm'
        >
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default HolidaySetting;
