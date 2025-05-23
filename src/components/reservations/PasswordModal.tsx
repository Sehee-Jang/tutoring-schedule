import { useState } from "react";
import ModalLayout from "../shared/ModalLayout";
import Button from "../shared/Button";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

const PasswordModal = ({ isOpen, onClose, onSuccess }: PasswordModalProps) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-lg font-bold mb-4 text-gray-700'>비밀번호 입력</h2>
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='border p-2 rounded w-full mb-4'
        placeholder='비밀번호를 입력하세요'
      />
      <div className='flex justify-end gap-2'>
        <Button
          variant='outline'
          onClick={onClose}
        >
          취소
        </Button>
        <Button variant='primary' onClick={() => onSuccess(password)}>
          확인
        </Button>
      </div>
    </ModalLayout>
  );
};

export default PasswordModal;
