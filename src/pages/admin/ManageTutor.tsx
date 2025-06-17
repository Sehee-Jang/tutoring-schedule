import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Tutor, TutorStatus } from "../../types/tutor";
import { useToast } from "../../hooks/use-toast";
import { useFetchTutors } from "../../hooks/useFetchTutors";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useTracks } from "../../hooks/useTracks";
import { useBatches } from "../../hooks/useBatches";
import TutorTable from "../../components/admin/tutors/TutorTable";
import TutorFormModal from "../../components/admin/tutors/TutorFormModal";
import TutorFilterPanel from "../../components/admin/tutors/TutorFilterPanel";

import AvailabilityModal from "../../components/availability/AvailabilityModal";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";

const ManageTutor = () => {
  const { user } = useAuth();
  const { showModal } = useModal();
  const { toast } = useToast();

  const { tutors, loading, error } = useFetchTutors({
    role: user?.role ?? "",
    organizationId: user?.organizationId ?? undefined,
    trackId: user?.trackId ?? undefined,
    batchId: user?.batchId ?? undefined,
  });
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

  // 수정 핸들러
  const handleEdit = (tutor: Tutor) => {
    setModalMode("edit");
    setSelectedTutor(tutor);
    setIsModalOpen(true);
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

  return (
    <div className='space-y-4'>
      <h2 className='text-gray-700 text-xl font-semibold mb-4'>튜터 관리</h2>

      <div className='flex justify-between items-center mb-6'>
        {error && (
          <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>
            {error}
          </div>
        )}
      </div>

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
        <div className='bg-red-100 text-red-700 p-4 mb-4 rounded'>{error}</div>
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
  );
};

export default ManageTutor;
