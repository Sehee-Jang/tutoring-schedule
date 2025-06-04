import { useState, useEffect } from "react";
import TrackTable from "../../components/admin/organizations/TrackTable";
import BatchTable from "../../components/admin/organizations/BatchTable";
import OrganizationTable from "../../components/admin/organizations/OrganizationTable";

const ManageOrganization = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedOrgId) {
      setSelectedTrackId(null); // 조직 변경 시 트랙 선택 초기화
    }
  }, [selectedOrgId]);

  return (
    <div className='flex h-full gap-4'>
      {/* 좌측: 조직 */}
      <aside className='w-1/4 bg-white rounded-xl shadow p-4'>
        <OrganizationTable
          selectedOrgId={selectedOrgId}
          onSelectOrg={(orgId: string) => {
            setSelectedOrgId(orgId);
            setSelectedTrackId(null); // 조직 바꾸면 트랙 초기화
          }}
        />
      </aside>

      {/* 우측: 트랙 + 기수 */}
      <main className='flex-1 flex gap-4'>
        {selectedOrgId ? (
          <>
            {/* 트랙 */}
            <div className='w-1/2 bg-white rounded-xl shadow p-4'>
              <TrackTable
                organizationId={selectedOrgId}
                selectedTrackId={selectedTrackId}
                onSelectTrack={(trackId) => setSelectedTrackId(trackId)}
              />
            </div>

            {/* 기수 */}
            <div className='w-1/2 bg-white rounded-xl shadow p-4'>
              {selectedTrackId ? (
                <BatchTable
                  organizationId={selectedOrgId}
                  trackId={selectedTrackId}
                />
              ) : (
                <div className='text-gray-500 text-center mt-20'>
                  왼쪽에서 트랙을 선택하세요.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center bg-white rounded-xl shadow'>
            <div className='text-gray-500'>왼쪽에서 조직을 선택하세요.</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageOrganization;
