import { useAuth } from "../../context/AuthContext";
import {
  isSuperAdmin,
  isOrganizationAdminOrHigher,
  isTrackAdminOrHigher,
} from "../../utils/roleUtils";
import ManagerTable from "../../components/admin/managers/ManagerTable";
import EmptyState from "../../components/admin/shared/EmptyState";

const ManageManagersPage = () => {
  const { user } = useAuth();

  //
  if (!user || !isTrackAdminOrHigher(user.role)) {
    return <EmptyState className='h-screen' message='접근 권한이 없습니다.' />;
  }

  // super_admin은 전체, 조직 관리자는 track/batch만
  const roleScope: ("organization" | "track" | "batch")[] = isSuperAdmin(
    user.role
  )
    ? ["organization", "track", "batch"]
    : isOrganizationAdminOrHigher(user.role)
    ? ["track", "batch"]
    : ["batch"];

  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>
        관리자 계정 관리
      </h2>
      <ManagerTable roleScope={roleScope} />
    </div>
  );
};

export default ManageManagersPage;
