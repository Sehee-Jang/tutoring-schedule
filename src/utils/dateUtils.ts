import { Holiday } from "@/types/tutor";

// 문자열로 날짜 비교
export const isHoliday = (today: string, tutorHolidays: Holiday[]): boolean => {
  return tutorHolidays.some(({ startDate, endDate }) => {
    const start = startDate;
    const end = endDate || start; // 종료일이 없으면 시작일로 사용
    return today >= start && today <= end;
  });
};
