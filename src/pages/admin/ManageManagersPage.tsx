import { useAuth } from "../../context/AuthContext";
import {
  isSuperAdmin,
  isOrganizationAdminOrHigher,
} from "../../utils/roleUtils";
import ManagerTable from "../../components/admin/managers/ManagerTable";

const ManageManagersPage = () => {
  const { user } = useAuth();

  if (!user || !isOrganizationAdminOrHigher(user.role)) {
    return <div>접근 권한이 없습니다.</div>;
  }

  // super_admin은 전체, 조직 관리자는 track/batch만
  const roleScope: ("organization" | "track" | "batch")[] = isSuperAdmin(
    user.role
  )
    ? ["organization", "track", "batch"]
    : ["track", "batch"];

    
  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>관리자 계정 관리</h2>
      <ManagerTable roleScope={roleScope} />
    </div>
  );
};

export default ManageManagersPage;
