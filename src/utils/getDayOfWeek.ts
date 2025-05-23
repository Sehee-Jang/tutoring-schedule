import { DAYS_OF_WEEK } from "../constants/days";

/**
 * 날짜(Date 또는 string)로부터 '월요일' 등 한글 요일명 반환
 * @param date 날짜 객체 또는 문자열
 * @returns 한글 요일명 ("월요일" 등) — 월요일 시작 기준
 */
export const getDayOfWeek = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const jsDay = parsedDate.getDay(); // 0=일요일, 6=토요일
  const mondayBasedIndex = (jsDay + 6) % 7; // 월요일=0, 일요일=6
  return DAYS_OF_WEEK[mondayBasedIndex];
};
