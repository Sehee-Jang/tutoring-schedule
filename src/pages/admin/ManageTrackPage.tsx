import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin, isTrackAdminOrHigher } from "../../utils/roleUtils";
import TrackTable from "../../components/admin/organizations/TrackTable";

const ManageTrackPage = () => {
  const { user } = useAuth();

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);


  const urlParams = new URLSearchParams(window.location.search);


  const isValidAccess = user && isTrackAdminOrHigher(user.role);
  const organizationId = user?.organization ?? null;

  if (!isValidAccess) {
    return <div>접근 권한이 없습니다.</div>;
  }

  if (!organizationId) {
    return <div>조직 정보가 없습니다.</div>;
  }

  return (
    <div className='space-y-4'>
      <TrackTable
        organizationId={organizationId}
        selectedTrackId={selectedTrackId}
        onSelectTrack={(trackId) => setSelectedTrackId(trackId)}
        autoSelectFirstTrack={false}
      />
    </div>
  );
};

export default ManageTrackPage;
