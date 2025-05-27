import { ReactNode } from "react";

// 관리자용 메뉴 타입
export interface AdminSidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

// 튜터용 메뉴 타입
export type TutorViewMode = "reservations" | "timeSettings";

export interface TutorSidebarItem {
  label: string;
  mode: TutorViewMode;
  icon: ReactNode;
}
