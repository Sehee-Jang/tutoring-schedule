// UserRole 타입
export type UserRole = "admin" | "tutor" | "student";

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

// export type UserRole = "admin" | "tutor" | "student";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   createdAt?: string;
// }
