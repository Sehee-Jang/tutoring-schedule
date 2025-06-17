import BatchTable from "../../components/admin/organizations/BatchTable";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin, isTrackAdminOrHigher } from "../../utils/roleUtils";

const ManageBatchePage = () => {
  const { user } = useAuth();

  if (!user || !isTrackAdminOrHigher(user.role)) {
    return <div>접근 권한이 없습니다.</div>;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const superAdminTrackId = urlParams.get("trackId");

  const organizationId = user.organizationId;
  const trackId = isSuperAdmin(user.role) ? superAdminTrackId : user.trackId;

  if (!organizationId || !trackId) {
    return <div>트랙 정보 또는 조직 정보가 없습니다.</div>;
  }

  return (
    <div className='space-y-4'>
      <BatchTable organizationId={organizationId} trackId={trackId} />
    </div>
  );
};

export default ManageBatchePage;
