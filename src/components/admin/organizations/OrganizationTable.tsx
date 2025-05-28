import React, { useState, useEffect } from "react";
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  fetchTracks,
  fetchBatches,
  createTrack,
  createBatch,
} from "../../../services/admin/organization";
import { useToast } from "../../../hooks/use-toast";
import { Organization } from "../../../types/organization";
import { Track } from "../../../types/track";
import { Batch } from "../../../types/batch";
import Button from "../../../components/shared/Button";
import OrganizationFormModal from "./OrganizationFormModal";
import { DeleteAlertDialog } from "../../../components/shared/DeleteAlertDialog";

interface OrganizationTableProps {
  selectedOrgId: string | null;
  onSelectOrg: (orgId: string) => void;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  selectedOrgId,
  onSelectOrg,
}) => {
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const [newTrack, setNewTrack] = useState("");
  const [newBatch, setNewBatch] = useState("");

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    const orgList = await fetchOrganizations();
    setOrganizations(orgList);
  };

  const loadTracks = async (organizationId: string) => {
    const trackList = await fetchTracks(organizationId);
    setTracks(trackList);
    setSelectedOrg(organizationId);
    setBatches([]); // 기수 초기화
    setSelectedTrack(null);
  };

  const loadBatches = async (organizationId: string, trackId: string) => {
    const batchList = await fetchBatches(organizationId, trackId);
    setBatches(batchList);
    setSelectedTrack(trackId);
  };

  const handleCreateTrack = async () => {
    if (!newTrack.trim() || !selectedOrg) return;
    await createTrack(selectedOrg, newTrack);
    toast({ title: "트랙 생성 완료" });
    setNewTrack("");
    loadTracks(selectedOrg);
  };

  const handleCreateBatch = async () => {
    if (!newBatch.trim() || !selectedOrg || !selectedTrack) return;
    await createBatch(
      selectedOrg,
      selectedTrack,
      newBatch,
      "2025-01-01",
      "2025-12-31"
    );
    toast({ title: "기수 생성 완료" });
    setNewBatch("");
    loadBatches(selectedOrg, selectedTrack);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedOrganization(null);
    setIsModalOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setModalMode("edit");
    setSelectedOrganization(org);
    setIsModalOpen(true);
  };

  const handleDelete = async (orgId: string) => {
    try {
      await deleteOrganization(orgId);
      toast({ title: "조직 삭제 완료" });
      loadOrganizations();
    } catch (err) {
      console.error("조직 삭제 오류:", err);
      toast({ title: "❌ 조직 삭제 실패", variant: "destructive" });
    }
  };

  const handleSubmit = async (name: string) => {
    try {
      if (modalMode === "create") {
        await createOrganization(name);
        toast({ title: "조직 생성 완료" });
      } else if (modalMode === "edit" && selectedOrganization) {
        await updateOrganization(selectedOrganization.id, name);
        toast({ title: "조직 수정 완료" });
      }
      setIsModalOpen(false);
      loadOrganizations();
    } catch (err) {
      console.error("조직 추가/수정 오류:", err);
      toast({ title: "❌ 작업 실패", variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>조직 목록</h2>

      <ul className='space-y-2'>
        {organizations.map((org) => (
          <li
            key={org.id}
            className={`cursor-pointer p-2 rounded ${
              selectedOrgId === org.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectOrg(org.id)}
          >
            <div className='flex justify-between items-center'>
              <span>{org.name}</span>

              {/* 수정 삭제 버튼 */}
              <div className='space-x-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 클릭 방지
                    handleEdit(org);
                  }}
                >
                  수정
                </Button>
                <DeleteAlertDialog
                  onConfirm={async () => {
                    await handleDelete(org.id);
                  }}
                  triggerLabel='삭제'
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button variant='primary' onClick={handleCreate}>
        조직 추가
      </Button>

      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialName={selectedOrganization?.name}
        mode={modalMode}
      />
    </div>
  );
};

export default OrganizationTable;
