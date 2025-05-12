import { useState } from "react";
import ModalLayout from "../shared/ModalLayout";
import PrimaryButton from "../shared/PrimaryButton";

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
        <button onClick={onClose} className='text-gray-500 hover:underline'>
          취소
        </button>
        <PrimaryButton onClick={() => onSuccess(password)}>확인</PrimaryButton>
      </div>
    </ModalLayout>
  );
};

export default PasswordModal;
