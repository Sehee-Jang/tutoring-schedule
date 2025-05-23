import { ChevronDown } from "lucide-react";
import Button from "../../shared/Button";

interface SaveDropdownProps {
  open: boolean;
  onToggle: () => void;
  onSaveCurrent: () => void;
  onSaveAll: () => void;
}

const SaveDropdown = ({
  open,
  onToggle,
  onSaveCurrent,
  onSaveAll,
}: SaveDropdownProps) => {
  return (
    <div className='flex justify-end relative inline-block text-left'>
      <Button
        variant='primary'
        className='text-sm flex items-center'
        onClick={onToggle}
      >
        <ChevronDown className='w-4 h-4' />
        저장 옵션
      </Button>

      {open && (
        <div className='absolute right-0 mt-10 w-40 bg-white shadow-md rounded border'>
          <button
            className='block w-full text-left px-4 py-2 hover:bg-gray-100'
            onClick={onSaveCurrent}
          >
            현재 요일 저장
          </button>
          <button
            className='block w-full text-left px-4 py-2 hover:bg-gray-100'
            onClick={onSaveAll}
          >
            모든 요일에 저장
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveDropdown;
