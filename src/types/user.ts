// UserRole 타입
export type UserRole =
  | "super_admin" // 최상위 관리자 (운영진)
  | "organization_admin" // 조직 관리자
  | "track_admin" // 트랙 관리자
  | "batch_admin" // 기수 관리자 (선택)
  | "tutor" // 튜터
  | "student"; // 학생 (수강생)

// User 타입 - 조직, 트랙, 기수 포함
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string; // 조직 ID
  track?: string; // 트랙 이름
  batch?: string; // 기수 (ex: 6기)
  createdAt?: string;
}
