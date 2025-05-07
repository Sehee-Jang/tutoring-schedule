// export const isHoliday = (
//   date: string, // yyyy-mm-dd
//   holidays: { startDate: string; endDate: string }[]
// ) => {
//   return holidays.some((h) => date >= h.startDate && date <= h.endDate);
// };

import { Holiday } from "@/types/tutor";

export const isHoliday = (today: string, tutorHolidays: Holiday[]): boolean => {
  const todayDate = new Date(today).getTime(); // 오늘 날짜를 타임스탬프로 변환

  return tutorHolidays.some(({ startDate, endDate }) => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : start; // 종료일이 없으면 시작일로 사용
    return todayDate >= start && todayDate <= end;
  });
};