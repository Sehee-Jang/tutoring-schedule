import { useEffect, useState } from "react";
import Button from "../../../components/shared/Button";
import ModalLayout from "../../../components/shared/ModalLayout";

interface OrganizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  mode: "create" | "edit";
}

const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName,
  mode,
}) => {
  const [name, setName] = useState(initialName || "");

  // initialName이 변경될 때 상태도 반영
  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  const handleSubmit = () => {
    onSubmit(name);
    setName("");
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === "create" ? "조직 추가" : "조직 수정"}
      </h2>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='border p-2 rounded w-full mb-4'
        placeholder='조직 이름'
      />
      <Button variant='primary' onClick={handleSubmit}>
        {mode === "create" ? "추가" : "수정"}
      </Button>
    </ModalLayout>
  );
};

export default OrganizationFormModal;
