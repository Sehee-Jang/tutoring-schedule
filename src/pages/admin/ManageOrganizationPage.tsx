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
      <div className='flex h-full gap-4'>
        <aside className='w-1/4 bg-white rounded-xl shadow p-4'>
          <OrganizationTable
            selectedOrgId={selectedOrgId}
            onSelectOrg={(orgId) => {
              setSelectedOrgId(orgId);
              setSelectedTrackId(null); // 조직 변경 시 트랙 초기화
            }}
          />
        </aside>

        <main className='flex-1 flex gap-4'>
          {selectedOrgId ? (
            <>
              <div className='w-1/2 bg-white rounded-xl shadow p-4'>
                <TrackTable
                  organizationId={selectedOrgId}
                  selectedTrackId={selectedTrackId}
                  onSelectTrack={setSelectedTrackId}
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
              <div className='text-gray-500'>왼쪽에서 조직을 선택하세요.</div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // organization_admin: 자신의 조직 내 모든 트랙/기수 관리 가능
  if (isOrganizationAdminOrHigher(role) && organizationId) {
    return (
      <div className='flex h-full gap-4'>
        <main className='flex-1 flex gap-4'>
          <div className='w-1/2 bg-white rounded-xl shadow p-4'>
            <TrackTable
              organizationId={organizationId}
              selectedTrackId={selectedTrackId}
              onSelectTrack={setSelectedTrackId}
            />
          </div>
          <div className='w-1/2 bg-white rounded-xl shadow p-4'>
            {selectedTrackId ? (
              <BatchTable
                organizationId={organizationId}
                trackId={selectedTrackId}
              />
            ) : (
              <div className='text-gray-500 text-center mt-20'>
                왼쪽에서 트랙을 선택하세요.
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // track_admin 전용: 기수 관리 화면만 표시
  if (isTrackAdminOrHigher(role) && organizationId && trackId) {
    return (
      <div className='w-full bg-white rounded-xl shadow p-4'>
        <BatchTable organizationId={organizationId} trackId={trackId} />
      </div>
    );
  }

  // ✅ 그 외 사용자: 접근 불가
  return (
    <div className='flex items-center justify-center h-full text-gray-500'>
      접근 권한이 없습니다.
    </div>
  );
  // return (
  //   <div className='flex h-full gap-4'>
  //     {/* super_admin만 좌측 조직 선택 표시 */}
  //     {isSuperAdmin(role) && (
  //       <aside className='w-1/4 bg-white rounded-xl shadow p-4'>
  //         <OrganizationTable
  //           selectedOrgId={selectedOrgId}
  //           onSelectOrg={(orgId: string) => {
  //             setSelectedOrgId(orgId);
  //             setSelectedTrackId(null);
  //           }}
  //         />
  //       </aside>
  //     )}

  //     {/* 트랙 + 기수 관리 */}
  //     <main className='flex-1 flex gap-4'>
  //       {selectedOrgId ? (
  //         <>
  //           <div className='w-1/2 bg-white rounded-xl shadow p-4'>
  //             <TrackTable
  //               organizationId={selectedOrgId}
  //               selectedTrackId={selectedTrackId}
  //               onSelectTrack={(trackId) => {
  //                 setSelectedTrackId(trackId);
  //               }}
  //             />
  //           </div>

  //           <div className='w-1/2 bg-white rounded-xl shadow p-4'>
  //             {selectedTrackId ? (
  //               <BatchTable
  //                 organizationId={selectedOrgId}
  //                 trackId={selectedTrackId}
  //               />
  //             ) : (
  //               <div className='text-gray-500 text-center mt-20'>
  //                 왼쪽에서 트랙을 선택하세요.
  //               </div>
  //             )}
  //           </div>
  //         </>
  //       ) : (
  //         <div className='flex-1 flex items-center justify-center bg-white rounded-xl shadow'>
  //           <div className='text-gray-500'>
  //             {isSuperAdmin(role)
  //               ? "왼쪽에서 조직을 선택하세요."
  //               : "관리할 조직이 없습니다."}
  //           </div>
  //         </div>
  //       )}
  //     </main>
  //   </div>
  // );
};

export default ManageOrganizationPage;
