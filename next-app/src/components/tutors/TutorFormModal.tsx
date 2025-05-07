import React from "react";

interface TutorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
  initialName?: string;
  initialEmail?: string;
  mode: "create" | "edit";
}

const TutorFormModal: React.FC<TutorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialEmail = "",
  mode,
}) => {
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);

  React.useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
  }, [initialName, initialEmail, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onSubmit(name, email);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4'>
          {mode === "create" ? "튜터 추가" : "튜터 수정"}
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='이름'
            className='border p-2 w-full rounded'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='email'
            placeholder='이메일'
            className='border p-2 w-full rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex justify-end space-x-2 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
            >
              취소
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              {mode === "create" ? "추가하기" : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorFormModal;
