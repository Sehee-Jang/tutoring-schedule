import React from "react";

const ReservationDetailModal = ({ isOpen, reservation, onClose }) => {
  if (!isOpen || !reservation) return null;

  const { teamName, tutor, timeSlot, question, figmaLink } = reservation;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    question: reservation?.question || "",
    figmaLink: reservation?.figmaLink || "",
  });

  useEffect(() => {
    if (reservation) {
      setForm({
        question: reservation.question || "",
        figmaLink: reservation.figmaLink || "",
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateReservation(reservation.id, form);
      alert("수정 완료!");
      setEditMode(false);
      onClose();
    } catch {
      alert("수정 실패");
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
      <div className='bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>예약 상세 정보</h2>

        <div className='space-y-3 text-sm text-gray-700'>
          <p>
            <strong>조 이름:</strong> {teamName}
          </p>
          <p>
            <strong>튜터:</strong> {tutor}
          </p>
          <p>
            <strong>시간:</strong> {timeSlot}
          </p>
          <p>
            <strong>질문:</strong>
            <br />
            {editMode ? (
              <textarea
                name='question'
                value={form.question}
                onChange={handleChange}
                className='border p-2 w-full text-sm'
              />
            ) : (
              form.question
            )}
          </p>
          <p>
            <strong>피그마 링크:</strong>
            <br />
            {editMode ? (
              <input
                type='text'
                name='figmaLink'
                value={form.figmaLink}
                onChange={handleChange}
                className='border p-2 w-full text-sm'
              />
            ) : (
              <a
                href={form.figmaLink}
                className='text-blue-600 underline'
                target='_blank'
              >
                {form.figmaLink}
              </a>
            )}
          </p>
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className='bg-[#262626] text-white px-3 py-1 rounded text-sm'
              >
                저장
              </button>
              <button
                onClick={() => setEditMode(false)}
                className='text-sm text-gray-500 hover:underline'
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className='bg-[#262626] text-white px-3 py-1 rounded text-sm'
            >
              수정
            </button>
          )}
          <button
            onClick={onClose}
            className='text-sm text-gray-500 hover:underline'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
