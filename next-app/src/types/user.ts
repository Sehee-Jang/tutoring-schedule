export type UserRole = "admin" | "tutor" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  
}
