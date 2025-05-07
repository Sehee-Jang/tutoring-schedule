"use client";

import React, { useEffect, useState } from "react";
import {
  fetchTutorHolidays,
  saveTutorHoliday,
  deleteTutorHoliday,
} from "@/services/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Holiday } from "@/types/tutor";

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

  // handleSave 함수 개선
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

  const isDateInvalid: boolean = !!(endDate && startDate > endDate);

  if (loading) return <p>휴무일 데이터를 불러오는 중입니다...</p>;

  return (
    <div className='space-y-6'>
      {/* 입력 영역 */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end min-h-[76px]'>
        <div className='flex flex-col space-y-1'>
          <label className='text-sm text-gray-700'>시작일</label>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-400'
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm font-medium text-gray-700'>종료일</label>
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`border ${
              isDateInvalid ? "border-red-500" : "border-gray-300"
            } rounded px-3 py-2 text-sm`}
          />
        </div>

        <div className='flex flex-col space-y-1'>
          <label className='text-sm text-gray-700'>사유</label>
          <input
            type='text'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='휴가, 세미나 참석 등'
            className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-400'
          />
        </div>

        <div className='flex items-end'>
          <button
            onClick={addHoliday}
            disabled={isDateInvalid}
            className={`text-sm px-4 py-2 rounded w-full ${
              isDateInvalid
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-[#262626] text-white hover:bg-[#1f1f1f]"
            }`}
          >
            휴무일 추가
          </button>
        </div>
      </div>
      {/* 테이블 */}
      <table className='w-full border text-sm'>
        <thead>
          <tr className='bg-gray-50 border-b'>
            <th className='p-2 border-r border-gray-200 text-left text-gray-700 w-64'>
              기간
            </th>
            <th className='p-2 border-r border-gray-200 text-left text-gray-700'>
              사유
            </th>
            <th className='p-2 text-center text-gray-700 w-32'>관리</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h.id} className='border-t'>
              <td className='p-2 border-r border-gray-200 text-gray-700'>
                {h.endDate
                  ? `${formatDate(h.startDate)} - ${formatDate(h.endDate)}`
                  : formatDate(h.startDate)}
              </td>
              <td className='p-2 border-r border-gray-200 text-gray-700'>
                {h.reason}
              </td>
              <td className='p-2 text-red-500 text-center'>
                <button
                  onClick={() => deleteHoliday(h.id)}
                  className='hover:underline'
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 저장 버튼 */}
      <div className='flex justify-end'>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm'
        >
          설정 저장
        </button>
      </div>
      ;
    </div>
  );
};

export default HolidaySetting;
