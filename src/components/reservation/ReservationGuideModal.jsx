import React from "react";
import ModalLayout from "../shared/ModalLayout"; // 경로 확인!

const ReservationGuideModal = ({ onClose }) => (
  <ModalLayout onClose={onClose}>
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold mb-2'>튜터링 예약 가이드</h2>

      <div>
        <h3 className='font-bold text-gray-700'>예약 방법</h3>
        <ol className='list-decimal ml-5 mt-1 space-y-1 text-sm text-gray-600'>
          <li>튜터를 선택합니다. (예: 김르탄)</li>
          <li>튜터님의 가능 시간 중에서 원하는 시간을 선택합니다.</li>
          <li>예약자 정보(조 또는 팀명)를 입력합니다.</li>
          <li>피그마, 노션 등의 링크를 붙여넣습니다.</li>
          <li>튜터님에게 질문하고 싶은 내용을 작성합니다.</li>
          <li>예약하기 버튼을 클릭하면 예약이 완료됩니다.</li>
        </ol>
      </div>

      <div>
        <h3 className='font-bold text-gray-700'>주의사항</h3>
        <ul className='list-disc ml-5 mt-1 space-y-1 text-sm text-gray-600'>
          <li>당일에만 예약이 가능합니다.</li>
          <li>최소 30분 전 예약이 가능합니다.</li>
          <li>이미 예약된 시간은 선택할 수 없습니다.</li>
          <li>모든 필드를 작성해야 예약이 가능합니다.</li>
          <li>예약 후에는 상단의 실시간 예약 현황에서 확인할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  </ModalLayout>
);

export default ReservationGuideModal;
