import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Tutor, TutorStatus } from "../../types/tutor";
import { useToast } from "../../hooks/use-toast";
import TutorFormModal from "../../components/admin/tutors/TutorFormModal";
import { useFetchTutors } from "../../hooks/useFetchTutors";
import { useModal } from "../../context/ModalContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { logout } from "../../services/auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetDatabase } from "../../services/admin/resetDatabase";
import OrganizationManager from "./OrganizationManager";
import Button from "../../components/shared/Button";
import AvailabilityModal from "../../components/availability/AvailabilityModal";
import TutorTable from "../../components/admin/tutors/TutorTable";
import TutorFilterPanel from "../../components/admin/tutors/TutorFilterPanel";
import { useAuth } from "../../context/AuthContext";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useTracks } from "../../hooks/useTracks";
import { useBatches } from "../../hooks/useBatches";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();
  const { toast } = useToast();

  const { tutors, loading, error } = useFetchTutors();
  const [filters, setFilters] = useState({
    organization: "",
    track: "",
    batch: "",
    searchText: "",
  });

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState("");

  const { organizations } = useOrganizations();
  const { tracks } = useTracks(selectedOrgId);
  const { batches } = useBatches(selectedOrgId, selectedTrackId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityModalTutor, setAvailabilityModalTutor] =
    useState<string>("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    console.log("필터 값 변경됨:", filters);
  }, [filters]);

  const handleEdit = (tutor: Tutor) => {
    setModalMode("edit");
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  // 리셋
  const handleResetDatabase = async () => {
    if (!window.confirm("⚠️ 모든 데이터베이스가 초기화됩니다. 진행할까요?"))
      return;
    setResetting(true);
    try {
      await resetDatabase();
      toast({
        title: "데이터베이스가 초기화되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("초기화 오류:", error);
      toast({
        title: "초기화에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  // 등록 핸들러
  const handleSubmit = async (name: string, email: string) => {
    try {
      if (modalMode === "create") {
        await addDoc(collection(db, "tutors"), {
          name,
          email,
          status: "active",
        });
      } else if (modalMode === "edit" && selectedTutor) {
        const tutorRef = doc(db, "tutors", selectedTutor.id);
        await updateDoc(tutorRef, { name, email });
      }
      setIsModalOpen(false);
      // fetchTutors 필요 없음! 자동 갱신됨
    } catch (err) {
      console.error("튜터 추가/수정 오류:", err);
    }
  };

  // 상태 관리 핸들러
  const handleStatusChange = async (tutor: Tutor, newStatus: TutorStatus) => {
    try {
      const tutorRef = doc(db, "users", tutor.id);
      await updateDoc(tutorRef, { status: newStatus });
      toast({
        title: `상태가 ${
          newStatus === "active"
            ? "활성"
            : newStatus === "inactive"
            ? "비활성"
            : "승인 대기"
        }로 변경되었습니다.`,
        variant: "default",
      });
    } catch (error) {
      console.error("상태 변경 오류:", error);
      toast({
        title: "상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 튜터 필터 핸들러
  const filteredTutors = tutors.filter((tutor) => {
    const matchOrg =
      !filters.organization || tutor.organization === filters.organization;
    const matchTrack = !filters.track || tutor.track === filters.track;
    const matchBatch = !filters.batch || tutor.batch === filters.batch; // 여기 batch.id 비교
    const matchSearch =
      !filters.searchText ||
      tutor.name.includes(filters.searchText) ||
      tutor.email.includes(filters.searchText);

    return matchOrg && matchTrack && matchBatch && matchSearch;
  });

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={[
        "super_admin",
        "organization_admin",
        "track_admin",
        "batch_admin",
      ]}
    >
      <div className='max-w-3xl mx-auto p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>튜터 관리</h1>

          {error && (
            <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>
              {error}
            </div>
          )}

          <Button
            variant='warning'
            onClick={handleResetDatabase}
            disabled={resetting}
          >
            {resetting ? "리셋 중..." : "데이터베이스 리셋"}
          </Button>

          <Button variant='icon' onClick={handleLogout} title='로그아웃'>
            <LogOut className='w-5 h-5' />
          </Button>
        </div>
        <OrganizationManager />

        {user && (
          <TutorFilterPanel
            userRole={user.role}
            organizations={organizations}
            tracks={tracks}
            batches={batches}
            onFilterChange={(filters) => {
              setFilters(filters);
              setSelectedOrgId(filters.organization);
              setSelectedTrackId(filters.track);
            }}
          />
        )}

        {error && (
          <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='text-center py-10'>Loading...</div>
        ) : (
          <TutorTable
            tutors={filteredTutors}
            onEdit={handleEdit}
            onChangeStatus={handleStatusChange}
            onShowAvailability={(id) =>
              showModal("availability", { selectedTutorId: id })
            }
          />
        )}

        <TutorFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialName={selectedTutor?.name}
          initialEmail={selectedTutor?.email}
          mode={modalMode}
        />

        <AvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          selectedTutorId={availabilityModalTutor}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
