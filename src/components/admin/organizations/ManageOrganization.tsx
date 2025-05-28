import { useState, useEffect } from "react";
import OrganizationTable from "./OrganizationTable";
import TrackTable from "./TrackTable";
import BatchTable from "./BatchTable";
import { useAuth } from "../../../context/AuthContext";
import {
  isSuperAdmin,
  isOrganizationAdminOrHigher,
  isTrackAdminOrHigher,
} from "../../../utils/roleUtils";

const ManageOrganization = () => {
  const { user } = useAuth();

  const role = user?.role;
  const organizationIdFromUser = user?.organization ?? null;
  const trackIdFromUser = user?.track ?? null;

  // ✅ 콘솔로 현재 사용자 정보 확인
  console.log("🔍 [ManageOrganization] user:", user);
  console.log("🔍 role:", role);
  console.log("🔍 organizationIdFromUser:", organizationIdFromUser);
  console.log("🔍 trackIdFromUser:", trackIdFromUser);

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (isOrganizationAdminOrHigher(role) && organizationIdFromUser) {
      console.log("✅ setting selectedOrgId:", organizationIdFromUser);
      setSelectedOrgId(organizationIdFromUser);
    }
    if (isTrackAdminOrHigher(role) && trackIdFromUser) {
      console.log("✅ setting selectedTrackId:", trackIdFromUser);
      setSelectedTrackId(trackIdFromUser);
    }
  }, [role, organizationIdFromUser, trackIdFromUser]);

  // ✅ track_admin 전용: 기수 관리 화면만 표시
  if (isTrackAdminOrHigher(role) && selectedOrgId && selectedTrackId) {
    console.log("🎯 rendering track_admin view");
    return (
      <div className='w-full bg-white rounded-xl shadow p-4'>
        <BatchTable organizationId={selectedOrgId} trackId={selectedTrackId} />
      </div>
    );
  }

  console.log("🎯 rendering general admin view");

  return (
    <div className='flex h-full gap-4'>
      {/* ✅ super_admin만 좌측 조직 선택 표시 */}
      {isSuperAdmin(role) && (
        <aside className='w-1/4 bg-white rounded-xl shadow p-4'>
          <OrganizationTable
            selectedOrgId={selectedOrgId}
            onSelectOrg={(orgId: string) => {
              console.log("✅ selected organization:", orgId);
              setSelectedOrgId(orgId);
              setSelectedTrackId(null);
            }}
          />
        </aside>
      )}

      {/* ✅ 트랙 + 기수 관리 */}
      <main className='flex-1 flex gap-4'>
        {selectedOrgId ? (
          <>
            <div className='w-1/2 bg-white rounded-xl shadow p-4'>
              <TrackTable
                organizationId={selectedOrgId}
                selectedTrackId={selectedTrackId}
                onSelectTrack={(trackId) => {
                  console.log("✅ selected track:", trackId);
                  setSelectedTrackId(trackId);
                }}
              />
            </div>

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
            <div className='text-gray-500'>
              {isSuperAdmin(role)
                ? "왼쪽에서 조직을 선택하세요."
                : "관리할 조직이 없습니다."}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageOrganization;
