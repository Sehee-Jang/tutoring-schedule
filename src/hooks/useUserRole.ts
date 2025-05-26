import { useAuth } from "../context/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();

  return {
    role: user?.role || null,
    organizationId: user?.organization || null,
    trackId: user?.track || null,
    batchId: user?.batch || null,
  };
};
