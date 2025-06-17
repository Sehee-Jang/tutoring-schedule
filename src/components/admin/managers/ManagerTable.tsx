import { useEffect, useState } from "react";
import { fetchManagersByRole } from "../../../services/admin/user";
import { useAuth } from "../../../context/AuthContext";
import { User, UserStatus } from "../../../types/user";
import Button from "../../../components/shared/Button";
import ManagerFormModal from "./ManagerFormModal";
import { db } from "../../../services/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useToast } from "../../../hooks/use-toast";
import ManagerStatusDropdown from "./ManagerStatusDropdown";

interface ManagerTableProps {
  roleScope: ("organization" | "track" | "batch")[];
}

const ManagerTable: React.FC<ManagerTableProps> = ({ roleScope }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orgManagers, setOrgManagers] = useState<User[]>([]);
  const [trackManagers, setTrackManagers] = useState<User[]>([]);
  const [batchManagers, setBatchManagers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTrackManagers();
    loadOrgManagers();
    loadBatchManagers();
  }, [user?.organizationId]);

  const loadOrgManagers = async () => {
    const orgManagerList = await fetchManagersByRole(
      "organization_admin",
      user!.organizationId ?? undefined
    );
    setOrgManagers(orgManagerList);
  };

  const loadTrackManagers = async () => {
    const trackManagerList = await fetchManagersByRole(
      "track_admin",
      user!.organizationId ?? undefined
    );
    setTrackManagers(trackManagerList);
  };

  const loadBatchManagers = async () => {
    const batchManagerList = await fetchManagersByRole(
      "batch_admin",
      user!.organizationId ?? undefined
    );
    setBatchManagers(batchManagerList);
  };

  const onChangeStatus = async (manager: User, newStatus: UserStatus) => {
    try {
      console.log("📌 onChangeStatus 호출됨:", manager);

      if (!manager.id || !manager.role) {
        throw new Error("관리자 정보가 불완전합니다.");
      }

      console.log("👤 manager.id", manager.id, typeof manager.id);

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

      // 변경 후 다시 목록 불러오기
      switch (manager.role) {
        case "organization_admin":
          await loadOrgManagers();
          break;
        case "track_admin":
          await loadTrackManagers();
          break;
        case "batch_admin":
          await loadBatchManagers();
          break;
        default:
          console.warn("관리자 역할이 유효하지 않음:", manager.role);
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      toast({ title: "상태 변경 실패", variant: "destructive" });
    }
  };

  return (
    <div className='space-y-6'>
      <Button variant='primary' size='sm' onClick={() => setIsModalOpen(true)}>
        관리자 추가
      </Button>

      {roleScope.includes("organization") && (
        <div className='overflow-x-auto'>
          <h3 className='text-lg mb-2'>조직 관리자</h3>
          {/* 조직 관리자 테이블 + 버튼 */}
          <table className='min-w-full bg-white border rounded'>
            <thead>
              <tr className='bg-gray-100 text-left text-sm font-semibold'>
                <td className='p-3 border'>이름</td>
                <td className='p-3 border'>이메일</td>
                <td className='p-3 border'>상태</td>
                <td className='p-3 border'>관리</td>
              </tr>
            </thead>
            <tbody>
              {orgManagers.map((orgManager) => (
                <tr key={orgManager.id} className='text-sm hover:bg-gray-50'>
                  <td className='p-3 border'>{orgManager.name}</td>
                  <td className='p-3 border'>{orgManager.email}</td>
                  <td className='p-3 border'>
                    <ManagerStatusDropdown
                      currentStatus={orgManager.status ?? "active"}
                      onChange={(newStatus) => {
                        onChangeStatus(orgManager, newStatus);
                      }}
                    />
                  </td>
                  <td className='p-3 border'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {roleScope.includes("track") && (
        <div>
          <h3 className='text-lg mb-2'>트랙 관리자</h3>

          {/* 트랙 관리자 테이블 + 버튼 */}
          <table className='min-w-full bg-white border rounded'>
            <thead>
              <tr className='bg-gray-100 text-left text-sm font-semibold'>
                <td className='p-3 border'>이름</td>
                <td className='p-3 border'>이메일</td>
                <td className='p-3 border'>상태</td>
                <td className='p-3 border'>관리</td>
              </tr>
            </thead>
            <tbody>
              {trackManagers.map((trackManager) => (
                <tr key={trackManager.id} className='text-sm hover:bg-gray-50'>
                  <td className='p-3 border'>{trackManager.name}</td>
                  <td className='p-3 border'>{trackManager.email}</td>
                  <td className='p-3 border'>
                    <ManagerStatusDropdown
                      currentStatus={trackManager.status ?? "active"}
                      onChange={(newStatus: UserStatus) =>
                        onChangeStatus(trackManager, newStatus)
                      }
                    />
                  </td>

                  <td className='p-3 border'></td>
                </tr>
              ))}
            </tbody>
          </table>

          <ManagerFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
      {roleScope.includes("batch") && (
        <div>
          <h3 className='text-lg mb-2'>기수 관리자</h3>
          {/* 기수 관리자 테이블 + 버튼 */}
          <table className='min-w-full bg-white border rounded'>
            <thead>
              <tr className='bg-gray-100 text-left text-sm font-semibold'>
                <td className='p-3 border'>이름</td>
                <td className='p-3 border'>이메일</td>
                <td className='p-3 border'>상태</td>
                <td className='p-3 border'>관리</td>
              </tr>
            </thead>
            <tbody>
              {batchManagers.map((batchManager) => (
                <tr key={batchManager.id} className='text-sm hover:bg-gray-50'>
                  <td className='p-3 border'>{batchManager.name}</td>
                  <td className='p-3 border'>{batchManager.email}</td>
                  <td className='p-3 border'>
                    <ManagerStatusDropdown
                      currentStatus={batchManager.status ?? "active"}
                      onChange={(newStatus: UserStatus) =>
                        onChangeStatus(batchManager, newStatus)
                      }
                    />
                  </td>
                  <td className='p-3 border'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerTable;
