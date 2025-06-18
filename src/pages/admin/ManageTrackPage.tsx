import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { isTrackAdminOrHigher } from "../../utils/roleUtils";
import TrackTable from "../../components/admin/organizations/TrackTable";
import EmptyState from "../../components/admin/shared/EmptyState";

const ManageTrackPage = () => {
  const { user } = useAuth();

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const isValidAccess = user && isTrackAdminOrHigher(user.role);
  const organizationId = user?.organizationId ?? null;

  if (!isValidAccess) {
    return <EmptyState className='h-screen' message='접근 권한이 없습니다.' />;
  }

  if (!organizationId) {
    return <EmptyState className='h-screen' message='조직 정보가 없습니다.' />;
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
