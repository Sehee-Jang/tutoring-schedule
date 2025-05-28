import { useEffect, useState } from "react";
import BatchTable from "../organizations/BatchTable";
import { fetchTrackById } from "../../../services/admin/organization"; // 트랙 정보 가져오는 서비스 필요

interface ManageTrackProps {
  trackId: string;
}

const ManageTrack: React.FC<ManageTrackProps> = ({ trackId }) => {
  const [organizationId, setOrganizationId] = useState<string>("");

  useEffect(() => {
    const loadTrackInfo = async () => {
      const track = await fetchTrackById(trackId);
      setOrganizationId(track.organizationId);
    };
    loadTrackInfo();
  }, [trackId]);

  if (!organizationId) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='bg-white rounded-xl shadow p-6'>
      <h2 className='text-xl font-semibold mb-4'>기수 관리</h2>
      <BatchTable organizationId={organizationId} trackId={trackId} />
    </div>
  );
};

export default ManageTrack;
