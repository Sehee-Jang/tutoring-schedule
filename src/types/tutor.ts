export type TutorStatus = "active" | "inactive" | "pending";

export interface Tutor {
  id: string; // Firestore document ID
  name: string;
  email: string;
  status: TutorStatus;
  organizationId?: string; // 조직 ID
  trackId?: string; // 트랙 ID
  batchIds?: string[]; // 기수 ID
}

export interface ExtendedTutor extends Tutor {
  organizationName?: string;
  trackName?: string;
  batchNames?: string[];
}

// Tutor의 개별 튜터링 가능 시간 (ex: 하루치)
export interface DailyAvailability {
  date: string; // '2025-05-02'
  timeSlots: string[]; // ['09:00-09:30', '10:00-10:30']
}

// 휴무일 설정용 타입
export interface Holiday {
  id: string; // Firestore 문서 ID
  tutorID: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  reason: string;
}
