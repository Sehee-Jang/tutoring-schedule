import ManageTrack from "../../components/admin/organizations/ManageTrack";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin, isTrackAdminOrHigher } from "../../utils/roleUtils";

const ManageTracks = () => {
  const { user } = useAuth();

  if (!user || !isTrackAdminOrHigher(user.role)) {
    return <div>접근 권한이 없습니다.</div>;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const superAdminTrackId = urlParams.get("trackId");

  const trackId = isSuperAdmin(user.role) ? superAdminTrackId : user.track;

  if (!trackId) {
    return <div>트랙 정보가 없습니다.</div>;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>
        트랙 관리자 대시보드
      </h2>
      <p>여기에 트랙 관리 기능을 추가하세요.</p>
      <ManageTrack trackId={trackId} />
    </div>
  );
};

export default ManageTracks;
