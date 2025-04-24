import React from "react";

const ReservationDetailModal = ({ isOpen, reservation, onClose }) => {
  if (!isOpen || !reservation) return null;

  const { teamName, tutor, timeSlot, question, figmaLink } = reservation;

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
            {question}
          </p>
          <p>
            <strong>피그마 링크:</strong>
            <br />
            <a
              href={figmaLink}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline break-words'
            >
              {figmaLink}
            </a>
          </p>
        </div>

        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
