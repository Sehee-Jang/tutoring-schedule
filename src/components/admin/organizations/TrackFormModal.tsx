import { useState, useEffect } from "react";
import Button from "../../../components/shared/Button";
import ModalLayout from "../../../components/shared/ModalLayout";

interface TrackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  mode: "create" | "edit";
}

const TrackFormModal: React.FC<TrackFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  mode,
}) => {
  const [name, setName] = useState(initialName || "");

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name);
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === "create" ? "트랙 추가" : "트랙 수정"}
      </h2>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='border p-2 rounded w-full mb-4'
        placeholder='트랙 이름'
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

export default TrackFormModal;
