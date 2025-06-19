import { UserRole } from "../types/user";
import { getAllowedRolesByUserRole } from "./getAllowedRolesByUserRole";

export interface FieldVisibility {
  showOrgSelect: boolean;
  showTrackSelect: boolean;
  showBatchSelect: boolean;
  showRoleSelect: boolean;
  allowedRoles: UserRole[];
}

export const getVisibleFieldsForRole = (
  userRole: UserRole | null | undefined,
  selectedRole: UserRole | ""
): FieldVisibility => {
  switch (userRole) {
    case "super_admin":
      return {
        showOrgSelect: true,
        showTrackSelect: ["track_admin", "batch_admin"].includes(selectedRole),
        showBatchSelect: selectedRole === "batch_admin",
        showRoleSelect: true,
        allowedRoles: getAllowedRolesByUserRole(userRole),
      };
    case "organization_admin":
      return {
        showOrgSelect: false,
        showTrackSelect: ["track_admin", "batch_admin"].includes(selectedRole),
        showBatchSelect: selectedRole === "batch_admin",
        showRoleSelect: true,
        allowedRoles: getAllowedRolesByUserRole(userRole),
      };
    case "track_admin":
      return {
        showOrgSelect: false,
        showTrackSelect: false,
        showBatchSelect: true,
        showRoleSelect: false,
        allowedRoles: getAllowedRolesByUserRole(userRole),
      };
    default:
      return {
        showOrgSelect: false,
        showTrackSelect: false,
        showBatchSelect: false,
        showRoleSelect: false,
        allowedRoles: [],
      };
  }
};

export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "슈퍼 관리자",
  organization_admin: "조직 관리자",
  track_admin: "트랙 관리자",
  batch_admin: "기수 관리자",
  tutor: "튜터",
  student: "수강생",
};
