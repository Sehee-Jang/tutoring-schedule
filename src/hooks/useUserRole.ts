import { useAuth } from "../context/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();

  return {
    role: user?.role || null,
    organizationId: user?.organizationId || null,
    trackId: user?.trackId || null,
    batchId: user?.batchId || null,
  };
};
