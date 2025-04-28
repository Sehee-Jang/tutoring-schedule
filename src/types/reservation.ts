export type ReservationStatus = "reserved" | "completed" | "canceled";

export interface Reservation {
  id: string;
  userId: string;
  tutor: string;
  date: string; // 예: '2025-05-01'
  timeSlot: string; // 예: '10:00-10:30'
  status: ReservationStatus;
  question?: string; // 선택사항: 예약할 때 질문 남긴 경우
  resourceLink?: string; // 선택사항: 링크 첨부한 경우
  createdAt?: string; // Firestore 저장된 생성일
}
