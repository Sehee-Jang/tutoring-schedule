import { UserRole } from "../types/user";

export const ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "organization_admin",
  "track_admin",
  "batch_admin",
];

export const isAdminRole = (role: UserRole | null | undefined): boolean => {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
};

export const isSuperAdmin = (role: UserRole | null | undefined): boolean => {
  return role === "super_admin";
};

export const isOrganizationAdminOrHigher = (
  role: UserRole | null | undefined
): boolean => {
  return ["super_admin", "organization_admin"].includes(role || "");
};

export const isTrackAdminOrHigher = (
  role: UserRole | null | undefined
): boolean => {
  return ["super_admin", "organization_admin", "track_admin"].includes(
    role || ""
  );
};

export const isBatchAdminOrHigher = (
  role: UserRole | null | undefined
): boolean => {
  return [
    "super_admin",
    "organization_admin",
    "track_admin",
    "batch_admin",
  ].includes(role || "");
};
