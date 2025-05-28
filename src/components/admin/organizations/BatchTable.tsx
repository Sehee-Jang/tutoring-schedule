import React, { useState, useEffect } from "react";
import {
  fetchBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../../../services/admin/organization";
import { Batch } from "../../../types/batch";
import Button from "../../../components/shared/Button";
import BatchFormModal from "./BatchFormModal";
import { useToast } from "../../../hooks/use-toast";

interface BatchTableProps {
  organizationId: string;
  trackId: string;
}

const BatchTable: React.FC<BatchTableProps> = ({ organizationId, trackId }) => {
  const { toast } = useToast();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  useEffect(() => {
    loadBatches();
  }, [organizationId, trackId]);

  const loadBatches = async () => {
    const batchList = await fetchBatches(organizationId, trackId);
    setBatches(batchList);
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    setModalMode("edit");
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteBatch(organizationId, trackId, batchId);
      toast({ title: "기수 삭제 완료" });
      loadBatches();
    } catch (err) {
      console.error("기수 삭제 오류:", err);
      toast({ title: "❌ 기수 삭제 실패", variant: "destructive" });
    }
  };

  const handleSubmit = async (
    name: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      if (modalMode === "create") {
        await createBatch(organizationId, trackId, name, startDate, endDate);
        toast({ title: "기수 생성 완료" });
      } else if (modalMode === "edit" && selectedBatch) {
        await updateBatch(
          organizationId,
          trackId,
          selectedBatch.id,
          name,
          startDate,
          endDate
        );
        toast({ title: "기수 수정 완료" });
      }
      setIsModalOpen(false);
      loadBatches();
    } catch (err) {
      console.error("기수 추가/수정 오류:", err);
      toast({ title: "❌ 작업 실패", variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>기수 목록</h2>

      <ul className='space-y-2'>
        {batches.map((batch) => (
          <li key={batch.id} className='p-2 rounded hover:bg-gray-100'>
            <div className='flex justify-between items-center'>
              <span>{batch.name}</span>
              <div className='space-x-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(batch);
                  }}
                >
                  수정
                </Button>
                <Button
                  size='sm'
                  variant='warning'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(batch.id);
                  }}
                >
                  삭제
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button variant='primary' onClick={handleCreate} className='mt-4'>
        기수 추가
      </Button>

      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialBatch={selectedBatch ?? undefined}
        mode={modalMode}
      />
    </div>
  );
};

export default BatchTable;
