import OrganizationTable from "../../components/admin/organizations/OrganizationTable";
import { useState, useEffect } from "react";
import TrackTable from "../../components/admin/organizations/TrackTable";
import BatchTable from "../../components/admin/organizations/BatchTable";
import { useAuth } from "../../context/AuthContext";
import {
  isSuperAdmin,
  isOrganizationAdminOrHigher,
  isTrackAdminOrHigher,
} from "../../utils/roleUtils";

const ManageOrganizationPage = () => {
  const { user } = useAuth();
  const role = user?.role;
  const organizationId = user?.organizationId ?? null;
  const trackId = user?.trackId ?? null;

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // 조직관리자 및 트랙관리자 초기 선택 설정
  useEffect(() => {
    if (!selectedOrgId && isOrganizationAdminOrHigher(role) && organizationId) {
      setSelectedOrgId(organizationId);
    }
    if (!selectedTrackId && isTrackAdminOrHigher(role) && trackId) {
      setSelectedTrackId(trackId);
    }
  }, [role, organizationId, trackId, selectedOrgId, selectedTrackId]);

  // super_admin: 전체 조직/트랙/기수를 선택해서 관리
  if (isSuperAdmin(role)) {
    return (
      <div className='flex flex-col lg:flex-row gap-4 h-full'>
        {/* 조직 테이블 (좌측 사이드) */}
        <aside className='lg:w-1/4 w-full bg-white rounded-2xl shadow p-4'>
          <OrganizationTable
            selectedOrgId={selectedOrgId}
            onSelectOrg={(orgId) => {
              setSelectedOrgId(orgId);
              setSelectedTrackId(null);
            }}
          />
        </aside>

        {/* 트랙 & 기수 테이블 (우측 메인) */}
        <main className='flex-1 flex flex-col lg:flex-row gap-4'>
          {selectedOrgId ? (
            <>
              <section className='lg:w-1/2 w-full bg-white rounded-2xl shadow p-4'>
                <TrackTable
                  organizationId={selectedOrgId}
                  selectedTrackId={selectedTrackId}
                  onSelectTrack={setSelectedTrackId}
                />
              </section>

              <section className='lg:w-1/2 w-full bg-white rounded-2xl shadow p-4'>
                {selectedTrackId ? (
                  <BatchTable
                    organizationId={selectedOrgId}
                    trackId={selectedTrackId}
                  />
                ) : (
                  <div className='text-gray-500 text-center mt-16'>
                    왼쪽에서 트랙을 선택하세요.
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-white rounded-2xl shadow'>
              <p className='text-gray-500'>왼쪽에서 조직을 선택하세요.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ✅ organization_admin 화면 구성
  if (isOrganizationAdminOrHigher(role) && organizationId) {
    return (
      <div className='flex flex-col lg:flex-row gap-4 h-full'>
        <main className='flex-1 flex flex-col lg:flex-row gap-4'>
          <section className='lg:w-1/2 w-full bg-white rounded-2xl shadow p-4'>
            <TrackTable
              organizationId={organizationId}
              selectedTrackId={selectedTrackId}
              onSelectTrack={setSelectedTrackId}
            />
          </section>

          <section className='lg:w-1/2 w-full bg-white rounded-2xl shadow p-4'>
            {selectedTrackId ? (
              <BatchTable
                organizationId={organizationId}
                trackId={selectedTrackId}
              />
            ) : (
              <div className='text-gray-500 text-center mt-16'>
                왼쪽에서 트랙을 선택하세요.
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // ✅ track_admin 화면 구성
  if (isTrackAdminOrHigher(role) && organizationId && trackId) {
    return (
      <div className='w-full bg-white rounded-2xl shadow p-4'>
        <BatchTable organizationId={organizationId} trackId={trackId} />
      </div>
    );
  }

  // ✅ 접근 불가 사용자
  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      접근 권한이 없습니다.
    </div>
  );
};

export default ManageOrganizationPage;
