import { useEffect, useState } from "react";
import { fetchManagersByRole } from "../../../services/admin/user";
import { useAuth } from "../../../context/AuthContext";
import { EnrichedUser, UserStatus } from "../../../types/user";
import Button from "../../../components/shared/Button";
import ManagerFormModal from "./ManagerFormModal";
import { db } from "../../../services/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useToast } from "../../../hooks/use-toast";
import ManagerStatusDropdown from "./ManagerStatusDropdown";
import { getNameById } from "../../../utils/getOrgNameById";
import { useOrganizations } from "../../../hooks/useOrganizations";

interface ManagerTableProps {
  roleScope: ("organization" | "track" | "batch")[];
}

const ManagerTable: React.FC<ManagerTableProps> = ({ roleScope }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { organizations } = useOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const [orgManagers, setOrgManagers] = useState<EnrichedUser[]>([]);
  const [trackManagers, setTrackManagers] = useState<EnrichedUser[]>([]);
  const [batchManagers, setBatchManagers] = useState<EnrichedUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const effectiveOrgId =
    user?.role === "super_admin" ? selectedOrgId : user?.organizationId;

  // useEffect(() => {
  //   loadManagers();
  // }, [user?.organizationId]);

  // const loadManagers = async () => {
  //   if (!user?.organizationId) return;

  //   const loadAndEnrich = async (
  //     role: "organization_admin" | "track_admin" | "batch_admin"
  //   ) => {
  //     const list = await fetchManagersByRole(role, user.organizationId!);
  //     const enriched = await Promise.all(
  //       list.map(async (u) => ({
  //         ...u,
  //         organizationName: await getNameById(
  //           "organizations",
  //           u.organizationId ?? undefined
  //         ),
  //         trackName: u.trackId
  //           ? await getNameById(
  //               `organizations/${u.organizationId}/tracks`,
  //               u.trackId
  //             )
  //           : "-",
  //         batchName: Array.isArray(u.batchIds)
  //           ? await Promise.all(
  //               u.batchIds.map((id) =>
  //                 getNameById(
  //                   `organizations/${u.organizationId}/tracks/${u.trackId}/batches`,
  //                   id
  //                 )
  //               )
  //             )
  //           : [],
  //       }))
  //     );

  //     return enriched;
  //   };

  //   if (roleScope.includes("organization")) {
  //     const data = await loadAndEnrich("organization_admin");
  //     setOrgManagers(data);
  //   }
  //   if (roleScope.includes("track")) {
  //     const data = await loadAndEnrich("track_admin");
  //     setTrackManagers(data);
  //   }
  //   if (roleScope.includes("batch")) {
  //     const data = await loadAndEnrich("batch_admin");
  //     setBatchManagers(data);
  //   }
  // };

  // const onChangeStatus = async (
  //   manager: EnrichedUser,
  //   newStatus: UserStatus
  // ) => {
  //   try {
  //     if (!manager.id || !manager.role) {
  //       throw new Error("관리자 정보가 불완전합니다.");
  //     }

  //     const userRef = doc(db, "users", manager.id);
  //     await updateDoc(userRef, { status: newStatus });

  //     toast({
  //       title: `상태가 ${
  //         newStatus === "active"
  //           ? "활성"
  //           : newStatus === "inactive"
  //           ? "비활성"
  //           : "승인 대기"
  //       }로 변경되었습니다.`,
  //     });

  //     // 목록 갱신
  //     await loadManagers();
  //   } catch (error) {
  //     console.error("상태 변경 오류:", error);
  //     toast({ title: "상태 변경 실패", variant: "destructive" });
  //   }
  // };

  // const renderTable = (title: string, managers: EnrichedUser[]) => (
  //   <div className='overflow-x-auto'>
  //     <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
  //     <table className='min-w-full bg-white border rounded'>
  //       <thead>
  //         <tr className='bg-gray-50 text-left text-sm text-gray-500'>
  //           <th className='px-4 py-2'>이름</th>
  //           <th className='px-4 py-2'>이메일</th>
  //           <th className='px-4 py-2'>조직</th>
  //           <th className='px-4 py-2'>트랙</th>
  //           <th className='px-4 py-2'>기수</th>
  //           <th className='px-4 py-2'>상태</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {managers.map((m) => (
  //           <tr key={m.id} className='text-sm hover:bg-gray-50 border-t'>
  //             <td className='px-4 py-2'>{m.name}</td>
  //             <td className='px-4 py-2'>{m.email}</td>
  //             <td className='px-4 py-2'>{m.organizationName ?? "-"}</td>
  //             <td className='px-4 py-2'>{m.trackName ?? "-"}</td>
  //             <td className='px-4 py-2'>
  //               {Array.isArray(m.batchName) && m.batchName.length > 0
  //                 ? m.batchName.join(", ")
  //                 : "-"}
  //             </td>
  //             <td className='px-4 py-2'>
  //               <ManagerStatusDropdown
  //                 currentStatus={m.status ?? "active"}
  //                 onChange={(newStatus) => onChangeStatus(m, newStatus)}
  //               />
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  useEffect(() => {
    if (effectiveOrgId) {
      loadManagers(effectiveOrgId);
    }
  }, [effectiveOrgId]);

  const loadManagers = async (orgId: string) => {
    const loadAndEnrich = async (
      role: "organization_admin" | "track_admin" | "batch_admin"
    ) => {
      const list = await fetchManagersByRole(role, orgId);
      const enriched = await Promise.all(
        list.map(async (u) => ({
          ...u,
          organizationName: await getNameById(
            "organizations",
            u.organizationId ?? ""
          ),
          trackName: u.trackId
            ? await getNameById(
                `organizations/${u.organizationId}/tracks`,
                u.trackId
              )
            : "-",
          batchName: Array.isArray(u.batchIds)
            ? await Promise.all(
                u.batchIds.map((id) =>
                  getNameById(
                    `organizations/${u.organizationId}/tracks/${u.trackId}/batches`,
                    id
                  )
                )
              )
            : [],
        }))
      );
      return enriched;
    };

    if (roleScope.includes("organization")) {
      const data = await loadAndEnrich("organization_admin");
      setOrgManagers(data);
    }
    if (roleScope.includes("track")) {
      const data = await loadAndEnrich("track_admin");
      setTrackManagers(data);
    }
    if (roleScope.includes("batch")) {
      const data = await loadAndEnrich("batch_admin");
      setBatchManagers(data);
    }
  };

  const onChangeStatus = async (
    manager: EnrichedUser,
    newStatus: UserStatus
  ) => {
    try {
      const userRef = doc(db, "users", manager.id);
      await updateDoc(userRef, { status: newStatus });

      toast({
        title: `상태가 ${
          newStatus === "active"
            ? "활성"
            : newStatus === "inactive"
            ? "비활성"
            : "승인 대기"
        }로 변경되었습니다.`,
      });

      if (effectiveOrgId) {
        await loadManagers(effectiveOrgId);
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      toast({ title: "상태 변경 실패", variant: "destructive" });
    }
  };

  const renderTable = (title: string, managers: EnrichedUser[]) => (
    <div className='overflow-x-auto'>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
      <table className='min-w-full bg-white border rounded'>
        <thead>
          <tr className='bg-gray-50 text-left text-sm text-gray-500'>
            <th className='px-4 py-2'>이름</th>
            <th className='px-4 py-2'>이메일</th>
            <th className='px-4 py-2'>조직</th>
            <th className='px-4 py-2'>트랙</th>
            <th className='px-4 py-2'>기수</th>
            <th className='px-4 py-2'>상태</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((m) => (
            <tr key={m.id} className='text-sm hover:bg-gray-50 border-t'>
              <td className='px-4 py-2'>{m.name}</td>
              <td className='px-4 py-2'>{m.email}</td>
              <td className='px-4 py-2'>{m.organizationName ?? "-"}</td>
              <td className='px-4 py-2'>{m.trackName ?? "-"}</td>
              <td className='px-4 py-2'>
                {Array.isArray(m.batchName) && m.batchName.length > 0
                  ? m.batchName.join(", ")
                  : "-"}
              </td>
              <td className='px-4 py-2'>
                <ManagerStatusDropdown
                  currentStatus={m.status ?? "active"}
                  onChange={(newStatus) => onChangeStatus(m, newStatus)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='space-y-8'>
      {user?.role === "super_admin" && (
        <div className='flex items-center gap-2'>
          <label className='text-sm text-gray-700'>조직 선택</label>
          <select
            value={selectedOrgId ?? ""}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className='border px-2 py-1 rounded text-sm'
          >
            <option value=''>-- 조직 선택 --</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className='flex justify-end'>
        <Button
          variant='primary'
          size='sm'
          onClick={() => setIsModalOpen(true)}
        >
          + 관리자 추가
        </Button>
      </div>

      {roleScope.includes("organization") &&
        renderTable("조직 관리자", orgManagers)}
      {roleScope.includes("track") && renderTable("트랙 관리자", trackManagers)}
      {roleScope.includes("batch") && renderTable("기수 관리자", batchManagers)}

      <ManagerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ManagerTable;
