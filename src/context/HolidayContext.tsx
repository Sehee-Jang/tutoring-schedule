// context/HolidayContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  fetchAllTutorHolidays,
  fetchTutorHolidays,
  saveTutorHoliday,
  deleteTutorHoliday,
} from "../services/firebase";
import { Holiday } from "@/types/tutor";

interface HolidayContextType {
  holidays: Record<string, Holiday[]>;
  updateHolidays: (tutor: string, data: Holiday[]) => Promise<void>;
  removeHoliday: (tutor: string, id: string) => Promise<void>;
}

const HolidayContext = createContext<HolidayContextType>({
  holidays: {},
  updateHolidays: async () => {},
  removeHoliday: async () => {},
});

export const useHolidayContext = () => useContext(HolidayContext);

export const HolidayProvider = ({ children }: { children: ReactNode }) => {
  const [holidays, setHolidays] = useState<Record<string, Holiday[]>>({});

  // 휴무일 불러오기 (튜터별)
  useEffect(() => {
    const load = async () => {
      const data: Holiday[] = await fetchAllTutorHolidays();
      const holidaysByTutor = data.reduce<Record<string, Holiday[]>>(
        (acc, holiday) => {
          const { tutorID, ...rest } = holiday;
          if (!acc[tutorID]) acc[tutorID] = [];
          acc[tutorID].push({ ...rest, tutorID });
          return acc;
        },
        {}
      );
      setHolidays(holidaysByTutor);
    };
    load();
  }, []);

  // ✅ 휴무일 업데이트 (새로운 방식)
  const updateHolidays = async (tutorID: string, data: Holiday[]) => {
    try {
      // 1. 기존 휴무일 삭제 (튜터별)
      const existingHolidays = await fetchTutorHolidays(tutorID);
      for (const holiday of existingHolidays) {
        await deleteTutorHoliday(holiday.id);
      }

      // 2. 새로운 휴무일 저장
      for (const { startDate, endDate, reason } of data) {
        await saveTutorHoliday(tutorID, startDate, endDate, reason);
      }

      // 3. 로컬 상태 업데이트
      setHolidays((prev) => ({ ...prev, [tutorID]: data }));
    } catch (error) {
      console.error("휴무일 저장 오류:", error);
    }
  };

  // 휴무일 삭제
  const removeHoliday = async (tutorID: string, id: string) => {
    await deleteTutorHoliday(id);
    setHolidays((prev) => ({
      ...prev,
      [tutorID]: prev[tutorID]?.filter((h) => h.id !== id) || [],
    }));
  };

  return (
    <HolidayContext.Provider
      value={{ holidays, updateHolidays, removeHoliday }}
    >
      {children}
    </HolidayContext.Provider>
  );
};
