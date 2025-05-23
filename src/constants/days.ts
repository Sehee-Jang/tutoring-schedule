export const DAYS_OF_WEEK = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
