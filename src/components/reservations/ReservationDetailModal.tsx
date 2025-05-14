import { useEffect, useState } from "react";
import type { Reservation } from "../../types/reservation";
import { useReservations } from "../../context/ReservationContext";
import ModalLayout from "../../components/shared/ModalLayout";
import Button from "../../components/shared/Button";
import TimeSlotButton from "../../components/shared/TimeSlotButton";
import useReservationEditor from "../../hooks/useReservationEditor";
import sortTimeSlots from "../../utils/sortTimeSlots";
import { fetchAvailableSlotsByDate } from "../../services/availability";
import { useTutors } from "../../context/TutorContext";

interface ReservationDetailModalProps {
  isOpen: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  isAdmin: boolean;
  isTutor?: boolean;
}

const ReservationDetailModal = ({
  isOpen,
  reservation,
  onClose,
  isAdmin,
  isTutor = false,
}: ReservationDetailModalProps) => {
  const { tutors } = useTutors();
  const { reservations } = useReservations();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { form, setForm, editMode, setEditMode, handleChange, update } =
    useReservationEditor(reservation, onClose);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!reservation) return;

      // 예약된 날짜의 요일 계산
      const daysOfWeek = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ];
      const reservationDate = new Date(reservation.classDate);
      const reservationDay = daysOfWeek[reservationDate.getDay()];

      // 예약된 튜터의 ID 찾기 (튜터 이름을 기준으로)
      const tutorID = tutors.find(
        (tutor) => tutor.name === reservation.tutor
      )?.id;

      if (!tutorID) {
        console.error("❌ 해당 튜터의 ID를 찾을 수 없습니다.");
        return;
      }

      // 해당 요일의 시간대 불러오기
      const slots = await fetchAvailableSlotsByDate(tutorID, reservationDay);
      const flatSlots = slots.flatMap((item) => item.activeSlots);

      // 불러온 시간대가 존재할 경우에만 저장
      if (flatSlots.length > 0) {
        setAvailableSlots(flatSlots);
      } else {
        console.error("❌ 시간대가 로드되지 않았습니다.");
      }
    };

    loadAvailableSlots();
  }, [reservation]);

  if (!isOpen || !reservation) return null;

  // 예약된 시간대 필터링
  const bookedTimeSlots = reservations
    .filter(
      (r: Reservation) =>
        r.tutor === reservation.tutor && r.id !== reservation.id
    )
    .map((r: Reservation) => r.timeSlot);

  // 예약 가능한 시간대 로직
  const filteredSlots = sortTimeSlots(
    availableSlots.filter((slot) => !bookedTimeSlots.includes(slot))
  );

  return (
    <ModalLayout onClose={onClose}>
      <h2 className='text-xl font-bold text-gray-800 mb-4'>예약 상세 정보</h2>

      <div className='space-y-4 text-sm text-gray-700'>
        <p>
          <strong>조 이름:</strong> {reservation.teamName}
        </p>

        <p>
          <strong>튜터:</strong> {reservation.tutor}
        </p>

        <div>
          <strong>질문:</strong>
          {editMode ? (
            <textarea
              name='question'
              value={form.question}
              onChange={handleChange}
              className='w-full border p-2 rounded mt-1 text-sm overflow-y-auto'
            />
          ) : (
            <div className='mt-1 max-h-32 overflow-y-auto p-2 bg-gray-50 border rounded text-sm whitespace-pre-wrap'>
              {form.question}
            </div>
          )}
        </div>

        <div>
          <strong>관련 링크 (피그마, 노션 등): </strong>
          {editMode ? (
            <input
              type='text'
              name='resourceLink'
              value={form.resourceLink}
              onChange={handleChange}
              className='w-full border px-3 py-2 rounded mt-1 text-sm'
            />
          ) : (
            <a
              href={form.resourceLink}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline break-all mt-1 inline-block'
            >
              {form.resourceLink}
            </a>
          )}
        </div>

        <div>
          <strong>예약 시간:</strong>
          {editMode ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
              {filteredSlots.map((slot) => {
                const [hour, min] = slot.split("-")[0].split(":").map(Number);
                const slotStart = hour * 60 + min;

                const now = new Date();
                const nowMinutes = now.getHours() * 60 + now.getMinutes();
                const minUserSelectableMinutes = nowMinutes + 30;

                const isPast = slotStart < nowMinutes; // 현재 시각 이전만 비활성화
                const isVisible =
                  isAdmin || isTutor
                    ? slotStart >= nowMinutes // 관리자는 현재시간 이후 다 보이게
                    : slotStart > minUserSelectableMinutes; // 일반 사용자는 현재시간+30분 이후만

                if (!isVisible) return null; // 조건에 안 맞으면 렌더링 안함

                return (
                  <TimeSlotButton
                    key={slot}
                    active={form.timeSlot === slot}
                    disabled={false} // 관리자는 과거시간 비활성화만
                    onClick={() =>
                      !(isPast && (isAdmin || isTutor)) &&
                      setForm((prev) => ({ ...prev, timeSlot: slot }))
                    }
                  >
                    {slot}
                  </TimeSlotButton>
                );
              })}
            </div>
          ) : (
            <p className='mt-1'>{form.timeSlot}</p>
          )}
        </div>
      </div>

      <div className='flex justify-center gap-4 mt-6'>
        {editMode ? (
          <>
            <Button variant='primary' onClick={update}>
              저장
            </Button>
            <button
              onClick={() => setEditMode(false)}
              className='text-sm text-gray-500 hover:underline'
            >
              취소
            </button>
          </>
        ) : (
          <Button variant='primary' onClick={() => setEditMode(true)}>
            수정
          </Button>
        )}
      </div>
    </ModalLayout>
  );
};

export default ReservationDetailModal;
