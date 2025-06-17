import { User } from "../types/user";

export const getRedirectPathForUser = (user: User | null): string => {
  if (!user) return "/login";

  if (!user.organization) {
    if (user.role === "super_admin") return "/admin";
    return "/complete-profile";
  }

  if (user.role === "tutor") {
    if (user.status === "pending") {
      return "/pending-approval";
    }
    return "/tutor";
  }

  if (user.role === "super_admin") return "/admin";

  return "/";
};
