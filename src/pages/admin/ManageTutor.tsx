import { useEffect, useState } from "react";
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
import AvailabilityModal from "../../components/availability/AvailabilityModal";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { FilterValues } from "../../types/tutor";

const ManageTutor = () => {
  const { user } = useAuth();
  const { showModal } = useModal();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    organizationId: "",
    trackId: "",
    batchIds: [] as string[],
    searchText: "",
    name: "",
    email: "",
    status: "",
  });

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState("");

  const { tutors, loading, error } = useFetchTutors({
    role: user?.role ?? "",
    organizationId: user?.organizationId ?? undefined,
    trackId: user?.trackId ?? undefined,
    batchIds: user?.batchIds ?? undefined,
  });

  const { organizations } = useOrganizations();
  const { tracks } = useTracks(selectedOrgId);
  const { batches, loading: batchesLoading } = useBatches(
    filters.organizationId || user?.organizationId || "",
    filters.trackId || user?.trackId || ""
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityModalTutor, setAvailabilityModalTutor] =
    useState<string>("");

  const handleEdit = (tutor: Tutor) => {
    setModalMode("edit");
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

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
    } catch (err) {
      console.error("튜터 추가/수정 오류:", err);
    }
  };

  const handleStatusChange = async (tutor: Tutor, newStatus: TutorStatus) => {
    try {
      const tutorRef = doc(db, "users", tutor.id);
      await updateDoc(tutorRef, { status: newStatus });
      toast({
        title:
          newStatus === "active"
            ? "활성화되었습니다."
            : newStatus === "inactive"
            ? "비활성화되었습니다."
            : "승인 대기로 변경되었습니다.",
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

  const filteredTutors = tutors.filter((tutor) => {
    const matchOrg =
      !filters.organizationId ||
      tutor.organizationId === filters.organizationId;
    const matchTrack = !filters.trackId || tutor.trackId === filters.trackId;
    const matchBatch =
      !filters.batchIds.length ||
      filters.batchIds.some((id) => tutor.batchIds?.includes(id));
    const matchSearch =
      !filters.searchText ||
      tutor.name.includes(filters.searchText) ||
      tutor.email.includes(filters.searchText);
    const matchName = !filters.name || tutor.name === filters.name;
    const matchEmail = !filters.email || tutor.email === filters.email;
    const matchStatus = !filters.status || tutor.status === filters.status;

    return (
      matchOrg &&
      matchTrack &&
      matchBatch &&
      matchSearch &&
      matchName &&
      matchEmail &&
      matchStatus
    );
  });

  useEffect(() => {
    if (!user) return;

    const updates: Partial<FilterValues> = {};
    let orgId = "";
    let trackId = "";

    // 조직 관리자
    if (user.role === "organization_admin" && user.organizationId) {
      updates.organizationId = user.organizationId;
      orgId = user.organizationId;
    }

    // 트랙 관리자
    if (user.role === "track_admin" && user.organizationId && user.trackId) {
      updates.organizationId = user.organizationId;
      updates.trackId = user.trackId;
      orgId = user.organizationId;
      trackId = user.trackId;
    }

    if (Object.keys(updates).length > 0) {
      setFilters((prev) => ({ ...prev, ...updates }));
      if (orgId) setSelectedOrgId(orgId);
      if (trackId) setSelectedTrackId(trackId);
    }
  }, [user]);

  return (
    <div className='space-y-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2'>
        <h2 className='text-gray-700 text-xl font-semibold mb-4'>튜터 관리</h2>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
          <input
            type='text'
            placeholder='이름 또는 이메일 검색'
            className='border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 placeholder-gray-400'
            value={filters.searchText}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchText: e.target.value }))
            }
          />
          <button
            onClick={() =>
              setFilters({
                organizationId: "",
                trackId: "",
                batchIds: [],
                searchText: "",
                name: "",
                email: "",
                status: "",
              })
            }
            className='text-sm px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 whitespace-nowrap'
          >
            필터 초기화
          </button>
        </div>
      </div>

      {loading || batchesLoading ? (
        <div className='text-center py-10'>Loading...</div>
      ) : error ? (
        <div className='text-center py-6 text-red-600'>
          튜터 데이터를 불러오는 데 실패했습니다.
        </div>
      ) : (
        <TutorTable
          tutors={filteredTutors}
          filters={filters}
          onFilterChange={(partial) =>
            setFilters((prev) => ({ ...prev, ...partial }))
          }
          organizationOptions={organizations}
          trackOptions={tracks}
          batchOptions={batches}
          onEdit={handleEdit}
          onChangeStatus={handleStatusChange}
          onShowAvailability={(id) => {
            setAvailabilityModalTutor(id);
            setIsAvailabilityModalOpen(true);
          }}
          setSelectedOrgId={setSelectedOrgId}
          // 별도 track 상태를 쓰지 않고 filters.trackId만 유지
          setSelectedTrackId={(id: string) =>
            setFilters((prev) => ({ ...prev, trackId: id }))
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
