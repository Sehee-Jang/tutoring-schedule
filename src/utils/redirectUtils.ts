import { User } from "../types/user";
import { isAdminRole } from "./roleUtils";

export const getRedirectPathForUser = (user: User | null): string => {
  if (!user || !user.role) return "/login";

  // 조직 정보가 없는 경우
  if (!user.organizationId) {
    // 최상위 관리자인 경우는 admin 페이지로
    if (user.role === "super_admin") return "/admin";

    // 나머지는 프로필 설정 페이지로
    return "/complete-profile";
  }

  // 튜터인 경우
  if (user.role === "tutor") {
    // 상태가 승인 대기인 경우 승인대기중 페이지로
    if (user.status === "pending") {
      return "/pending-approval";
    }

    // 나머지는 튜터 페이지로
    return "/tutor";
  }

  // 관리자인 경우 관리자 페이지로
  if (isAdminRole(user.role)) return "/admin";

  return "/";
};
