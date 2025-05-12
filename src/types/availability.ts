// export interface Availability {
//   [tutorName: string]: string[];
//   // 예시: { "김르ㄴ": ["09:00-09:30", "10:00-10:30"] }
// }

export interface Availability {
  [tutorId: string]: {
    [date: string]: string[];
  };
}

// Tutor의 개별 튜터링 가능 시간 (ex: 하루치)
export interface DailyAvailability {
  date: string; // '2025-05-02'
  timeSlots: string[]; // ['09:00-09:30', '10:00-10:30']
}
