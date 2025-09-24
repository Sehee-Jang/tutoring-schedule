import { useState, useEffect } from "react";
import { useBatches } from "../../../hooks/useBatches";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useToast } from "../../../hooks/use-toast";

interface BatchDropdownProps {
  tutorId: string;
  currentBatchIds: string[];
  organizationId?: string;
  trackId?: string;
}

const BatchDropdown: React.FC<BatchDropdownProps> = ({
  tutorId,
  currentBatchIds,
  organizationId,
  trackId,
}) => {
  const { toast } = useToast();
  const { batches, loading } = useBatches(organizationId || "", trackId || "");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentBatchIds || []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedIds(currentBatchIds || []);
  }, [currentBatchIds]);

  const toggleBatch = async (batchId: string) => {
    const updated = selectedIds.includes(batchId)
      ? selectedIds.filter((id) => id !== batchId)
      : [...selectedIds, batchId];

    try {
      setSelectedIds(updated); // UI 즉시 반응
      await updateDoc(doc(db, "users", tutorId), {
        batchIds: updated,
      });
      toast({ title: "기수 정보가 업데이트되었습니다." });
    } catch (err) {
      toast({ title: "기수 업데이트 실패", variant: "destructive" });
      console.error(err);
    }
  };

  return (
    <div className='relative inline-block text-left'>
      <button className='flex flex-wrap gap-1' onClick={() => setOpen(!open)}>
        {selectedIds.length > 0 ? (
          selectedIds.map((id) => {
            const name = batches.find((b) => b.id === id)?.name;
            return (
              <span
                key={id}
                className='px-2 py-0.5 text-xs font-medium rounded-full bg-[#F1F5FF] text-[#1E40AF] border border-[#93C5FD]'
              >
                {name}
              </span>
            );
          })
        ) : (
          <span className='text-gray-400'>기수 선택</span>
        )}
      </button>

      {open && !loading && (
        <div className='absolute z-10 mt-1 w-44 max-h-60 overflow-auto bg-white border rounded shadow'>
          {batches.map((batch) => (
            <button
              key={batch.id}
              onClick={() => toggleBatch(batch.id)}
              className={`block w-full px-3 py-1 text-sm text-left hover:bg-gray-100 ${
                selectedIds.includes(batch.id)
                  ? "bg-blue-100 font-semibold"
                  : ""
              }`}
            >
              {batch.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchDropdown;
