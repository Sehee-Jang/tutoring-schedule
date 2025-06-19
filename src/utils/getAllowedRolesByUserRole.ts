import { UserRole } from "../types/user";

export const getAllowedRolesByUserRole = (
  userRole: UserRole | null | undefined
): UserRole[] => {
  switch (userRole) {
    case "super_admin":
      return ["organization_admin", "track_admin", "batch_admin"];
    case "organization_admin":
      return ["track_admin", "batch_admin"];
    case "track_admin":
      return ["batch_admin"];
    default:
      return [];
  }
};
