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

// import { useState, useEffect } from "react";
// import {
//   fetchOrganizations,
//   createOrganization,
//   updateOrganization,
//   deleteOrganization,
//   fetchTracks,
//   fetchBatches,
//   createTrack,
//   createBatch,
// } from "../../services/admin/organization";
// import { useToast } from "../../hooks/use-toast";
// import Button from "../../components/shared/Button";
// import OrganizationTable from "../../components/admin/organizations/OrganizationTable1";
// import OrganizationFormModal from "../../components/admin/organizations/OrganizationFormModal";

// interface Organization {
//   id: string;
//   name: string;
// }

// interface Track {
//   id: string;
//   name: string;
// }

// interface Batch {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
// }

// const ManageOrganizations = () => {
//   const { toast } = useToast();

//   const [organizations, setOrganizations] = useState<Organization[]>([]);

//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [batches, setBatches] = useState<Batch[]>([]);
//   const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
//   const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

//   const [newOrganization, setNewOrganization] = useState("");
//   const [newTrack, setNewTrack] = useState("");
//   const [newBatch, setNewBatch] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"create" | "edit">("create");
//   const [selectedOrganization, setSelectedOrganization] =
//     useState<Organization | null>(null);

//   useEffect(() => {
//     loadOrganizations();
//   }, []);

//   const loadOrganizations = async () => {
//     const orgList = await fetchOrganizations();
//     setOrganizations(orgList);
//   };

//   const loadTracks = async (organizationId: string) => {
//     const trackList = await fetchTracks(organizationId);
//     setTracks(trackList);
//     setSelectedOrg(organizationId);
//     setBatches([]); // 기수 초기화
//     setSelectedTrack(null);
//   };

//   const loadBatches = async (organizationId: string, trackId: string) => {
//     const batchList = await fetchBatches(organizationId, trackId);
//     setBatches(batchList);
//     setSelectedTrack(trackId);
//   };

//   const handleCreateTrack = async () => {
//     if (!newTrack.trim() || !selectedOrg) return;
//     await createTrack(selectedOrg, newTrack);
//     toast({ title: "트랙 생성 완료" });
//     setNewTrack("");
//     loadTracks(selectedOrg);
//   };

//   const handleCreateBatch = async () => {
//     if (!newBatch.trim() || !selectedOrg || !selectedTrack) return;
//     await createBatch(
//       selectedOrg,
//       selectedTrack,
//       newBatch,
//       "2025-01-01",
//       "2025-12-31"
//     );
//     toast({ title: "기수 생성 완료" });
//     setNewBatch("");
//     loadBatches(selectedOrg, selectedTrack);
//   };

//   // 새 조직 생성 버튼 핸들러
//   const handleCreateOrganization = async () => {
//     if (!newOrganization.trim()) return;
//     await createOrganization(newOrganization);
//     toast({ title: "조직 생성 완료" });
//     setNewOrganization("");
//     loadOrganizations();
//   };

//   // 수정 핸들러
//   const handleEdit = (org: Organization) => {
//     setModalMode("edit");
//     setSelectedOrganization(org);
//     setIsModalOpen(true);
//   };

//   // 삭제 핸들러
//   const handleDelete = async (orgId: string) => {
//     try {
//       await deleteOrganization(orgId);
//       toast({ title: "✅ 조직 삭제 완료" });
//       loadOrganizations();
//     } catch (err) {
//       console.error("조직 삭제 오류:", err);
//       toast({ title: "❌ 조직 삭제 실패", variant: "destructive" });
//     }
//   };

//   // 등록 핸들러
//   const handleSubmit = async (name: string) => {
//     try {
//       if (modalMode === "create") {
//         await createOrganization(name);
//         toast({ title: "✅ 조직 생성 완료" });
//       } else if (modalMode === "edit" && selectedOrganization) {
//         await updateOrganization(selectedOrganization.id, name);
//         toast({ title: "✅ 조직 수정 완료" });
//       }
//       setIsModalOpen(false);
//       loadOrganizations();
//     } catch (err) {
//       console.error("조직 추가/수정 오류:", err);
//       toast({ title: "❌ 작업 실패", variant: "destructive" });
//     }
//   };

//   return (
//     <div className='space-y-4'>
//       <h2 className='text-gray-700 text-xl font-semibold mb-4'>조직 관리</h2>

//       {/* 조직 생성 */}
//       <div className='mb-4'>
//         <input
//           type='text'
//           placeholder='새 조직 이름'
//           value={newOrganization}
//           onChange={(e) => setNewOrganization(e.target.value)}
//           className='border p-2 rounded mr-2'
//         />
//         <Button variant='primary' onClick={handleCreateOrganization}>
//           새 조직 생성
//         </Button>
//       </div>

//       {/* 조직 목록 */}
//       <h2 className='text-xl font-semibold mb-2'>조직 목록</h2>
//       {/* {organizations.map((org) => (
//         <div key={org.id} className='mb-2'>
//           <span>{org.name}</span>

//           <button
//             onClick={() => loadTracks(org.id)}
//             className='ml-2 text-blue-500 underline'
//           >
//             트랙 보기
//           </button>
//         </div>
//       ))} */}
//       <OrganizationTable
//         organizations={organizations}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />

//       {/* 트랙 목록 */}
//       {selectedOrg && (
//         <div className='mt-6'>
//           <h2 className='text-xl font-semibold mb-2'>트랙 목록</h2>
//           <input
//             type='text'
//             placeholder='새 트랙 이름'
//             value={newTrack}
//             onChange={(e) => setNewTrack(e.target.value)}
//             className='border p-2 rounded mr-2'
//           />
//           <Button variant='primary' onClick={handleCreateTrack}>
//             트랙 생성
//           </Button>

//           {tracks.map((track) => (
//             <div key={track.id} className='ml-4'>
//               <span>{track.name}</span>
//               <button
//                 onClick={() => loadBatches(selectedOrg, track.id)}
//                 className='ml-2 text-blue-500 underline'
//               >
//                 기수 보기
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 기수 목록 */}
//       {selectedTrack && (
//         <div className='mt-6'>
//           <h2 className='text-xl font-semibold mb-2'>기수 목록</h2>
//           <input
//             type='text'
//             placeholder='새 기수 이름'
//             value={newBatch}
//             onChange={(e) => setNewBatch(e.target.value)}
//             className='border p-2 rounded mr-2'
//           />
//           <Button variant='primary' onClick={handleCreateBatch}>
//             기수 생성
//           </Button>

//           {batches.map((batch) => (
//             <div key={batch.id} className='ml-4'>
//               <span>{batch.name} (2025-01-01 ~ 2025-12-31)</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageOrganizations;
