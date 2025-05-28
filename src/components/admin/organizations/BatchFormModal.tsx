import { useState, useEffect } from "react";
import Button from "../../../components/shared/Button";
import ModalLayout from "../../../components/shared/ModalLayout";
import { Batch } from "../../../types/batch";

interface BatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, startDate: string, endDate: string) => void;
  initialBatch?: Batch;
  mode: "create" | "edit";
}

const BatchFormModal: React.FC<BatchFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialBatch,
  mode,
}) => {
  const [name, setName] = useState(initialBatch?.name || "");
  const [startDate, setStartDate] = useState(initialBatch?.startDate || "");
  const [endDate, setEndDate] = useState(initialBatch?.endDate || "");

  useEffect(() => {
    setName(initialBatch?.name || "");
    setStartDate(initialBatch?.startDate || "");
    setEndDate(initialBatch?.endDate || "");
  }, [initialBatch]);

  const handleSubmit = () => {
    if (!name.trim() || !startDate || !endDate) return;
    onSubmit(name, startDate, endDate);
    setName("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === "create" ? "기수 추가" : "기수 수정"}
      </h2>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='border p-2 rounded w-full mb-2'
        placeholder='기수 이름'
      />
      <input
        type='date'
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className='border p-2 rounded w-full mb-2'
      />
      <input
        type='date'
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className='border p-2 rounded w-full mb-4'
      />
      <div className='flex justify-end space-x-2'>
        <Button variant='outline' onClick={onClose}>
          취소
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          {mode === "create" ? "추가" : "수정"}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default BatchFormModal;
