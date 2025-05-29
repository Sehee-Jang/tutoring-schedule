"use client";

import { useEffect, useState } from "react";
import { useAvailability } from "../../context/AvailabilityContext";
import { useTutors } from "../../context/TutorContext";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ModalLayout from "../../components/shared/ModalLayout";
import TimeSlotButton from "../../components/shared/TimeSlotButton";
import { generateTimeSlots } from "../../utils/generateTimeSlots";
import { format } from "date-fns";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvailabilityModal = ({ isOpen }: AvailabilityModalProps) => {
  const { closeModal } = useModal();
  // const isOpen = modalType === "login";

  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const { tutors } = useTutors();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";

  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  ); // { 튜터이름: ["시간대", ...] }
  const slots = generateTimeSlots();

  // // tutors가 바뀔 때 초기값 세팅
  // useEffect(() => {
  //   if (tutors.length > 0 && !selectedTutor) {
  //     setSelectedTutor(tutors[0].name);
  //   }
  // }, [tutors, selectedTutor]);

  // // 모달 열릴 때 Firestore에서 불러온 시간대 상태로 복사
  // useEffect(() => {
  //   if (isOpen) {
  //     setAvailability(globalAvailability);
  //   }
  // }, [isOpen, globalAvailability]);

  // selectedTutor 초기값 설정
  useEffect(() => {
    if (isTutor && user?.name) {
      setSelectedTutor(user.name);
    } else if (isAdmin && tutors.length > 0 && !selectedTutor) {
      setSelectedTutor(tutors[0].name);
    }
  }, [tutors, selectedTutor, isAdmin, isTutor, user]);

  // 모달 열릴 때 global availability 복사
  useEffect(() => {
    if (isOpen) {
      // 글로벌 availability를 단순화하여 상태에 저장
      const simplifiedAvailability: Record<string, string[]> = {};
      Object.keys(globalAvailability).forEach((tutorId) => {
        const dates = Object.keys(globalAvailability[tutorId]);
        if (dates.length > 0) {
          // 가장 첫 번째 날짜의 슬롯을 사용 (오늘 날짜)
          simplifiedAvailability[tutorId] =
            globalAvailability[tutorId][dates[0]];
        }
      });
      setAvailability(simplifiedAvailability);
    }
  }, [isOpen, globalAvailability]);

  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      const current = prev[selectedTutor] || [];
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [selectedTutor]: updated };
    });
  };

  const handleSave = async () => {
    const todayString = format(new Date(), "yyyy-MM-dd");
    await updateAvailability(
      selectedTutor,
      todayString,
      availability[selectedTutor] || []
    );
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={closeModal}>
      <h2 className='text-xl font-bold mb-4 text-blue-800'>
        {selectedTutor
          ? `${selectedTutor} 튜터님의 시간 설정`
          : "튜터 가능 시간 설정"}
      </h2>
      {/* 튜터 선택 */}
      {/* <div className='mb-4'>
        <label className='font-semibold text-sm text-gray-600 mr-2'>
          튜터 선택:
        </label>
        <select
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          className='border px-3 py-1 rounded'
        >
          {tutors.map((tutor) => (
            <option key={tutor.id} value={tutor.name}>
              {tutor.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* 관리자만 튜터 선택 드롭다운 사용 가능 */}
      {isAdmin && (
        <div className='mb-4'>
          <label className='font-semibold text-sm text-gray-600 mr-2'>
            튜터 선택:
          </label>
          <select
            value={selectedTutor}
            onChange={(e) => setSelectedTutor(e.target.value)}
            className='border px-3 py-1 rounded'
          >
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.name}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 시간 선택 */}
      <div className='grid grid-cols-3 sm:grid-cols-3 gap-2 text-sm text-gray-700 mb-4 max-h-64 overflow-y-auto'>
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot}
            active={availability[selectedTutor]?.includes(slot)}
            disabled={false}
            onClick={() => toggleSlot(slot)}
          >
            {slot}
          </TimeSlotButton>
        ))}
      </div>

      {/* 저장/닫기 버튼 */}
      <div className='flex justify-end gap-2'>
        <button
          onClick={closeModal}
          className='text-gray-600 hover:underline text-sm'
        >
          닫기
        </button>
        <button
          onClick={handleSave}
          className='bg-blue-600 text-white px-4 py-2 rounded text-sm'
        >
          저장
        </button>
      </div>
    </ModalLayout>
  );
};

export default AvailabilityModal;

// "use client";

// import { useEffect, useState } from "react";
// import { useAvailability } from "../../context/AvailabilityContext";
// import { useTutors } from "../../context/TutorContext";
// import { useAuth } from "../../context/AuthContext";
// import { useModal } from "../../context/ModalContext";
// import ModalLayout from "../shared/ModalLayout";
// import TimeSlotButton from "../shared/TimeSlotButton";

// const generateTimeSlots = (): string[] => {
//   const slots: string[] = [];
//   for (let hour = 9; hour < 21; hour++) {
//     slots.push(
//       `${String(hour).padStart(2, "0")}:00-${String(hour).padStart(2, "0")}:30`
//     );
//     slots.push(
//       `${String(hour).padStart(2, "0")}:30-${String(hour + 1).padStart(
//         2,
//         "0"
//       )}:00`
//     );
//   }
//   return slots;
// };

// const AvailabilityModal = () => {
//   const { modalType, closeModal } = useModal();
//   const isOpen = modalType === "availability";

//   const { availability: globalAvailability, updateAvailability } =
//     useAvailability();
//   const { tutors } = useTutors();
//   const { user } = useAuth();
//   const isAdmin = user?.role === "admin";
//   const isTutor = user?.role === "tutor";

//   const [selectedTutor, setSelectedTutor] = useState<string>("");
//   const [availability, setAvailability] = useState<Record<string, string[]>>(
//     {}
//   ); // { 튜터이름: ["시간대", ...] }
//   const slots = generateTimeSlots();

//   // // tutors가 바뀔 때 초기값 세팅
//   // useEffect(() => {
//   //   if (tutors.length > 0 && !selectedTutor) {
//   //     setSelectedTutor(tutors[0].name);
//   //   }
//   // }, [tutors, selectedTutor]);

//   // // 모달 열릴 때 Firestore에서 불러온 시간대 상태로 복사
//   // useEffect(() => {
//   //   if (isOpen) {
//   //     setAvailability(globalAvailability);
//   //   }
//   // }, [isOpen, globalAvailability]);

//   // selectedTutor 초기값 설정
//   useEffect(() => {
//     if (isTutor && user?.name) {
//       setSelectedTutor(user.name);
//     } else if (isAdmin && tutors.length > 0 && !selectedTutor) {
//       setSelectedTutor(tutors[0].name);
//     }
//   }, [tutors, selectedTutor, isAdmin, isTutor, user]);

//   // 모달 열릴 때 global availability 복사
//   useEffect(() => {
//     if (isOpen) {
//       setAvailability(globalAvailability);
//     }
//   }, [isOpen, globalAvailability]);

//   const toggleSlot = (slot: string) => {
//     setAvailability((prev) => {
//       const current = prev[selectedTutor] || [];
//       const updated = current.includes(slot)
//         ? current.filter((s) => s !== slot)
//         : [...current, slot];
//       return { ...prev, [selectedTutor]: updated };
//     });
//   };

//   const handleSave = async () => {
//     await updateAvailability(selectedTutor, availability[selectedTutor] || []);
//     closeModal();
//   };

//   if (!isOpen) return null;

//   return (
//     <ModalLayout onClose={closeModal}>
//       <h2 className='text-xl font-bold mb-4 text-blue-800'>
//         {selectedTutor
//           ? `${selectedTutor} 튜터님의 시간 설정`
//           : "튜터 가능 시간 설정"}
//       </h2>
//       {/* 튜터 선택 */}
//       {/* <div className='mb-4'>
//         <label className='font-semibold text-sm text-gray-600 mr-2'>
//           튜터 선택:
//         </label>
//         <select
//           value={selectedTutor}
//           onChange={(e) => setSelectedTutor(e.target.value)}
//           className='border px-3 py-1 rounded'
//         >
//           {tutors.map((tutor) => (
//             <option key={tutor.id} value={tutor.name}>
//               {tutor.name}
//             </option>
//           ))}
//         </select>
//       </div> */}

//       {/* 관리자만 튜터 선택 드롭다운 사용 가능 */}
//       {isAdmin && (
//         <div className='mb-4'>
//           <label className='font-semibold text-sm text-gray-600 mr-2'>
//             튜터 선택:
//           </label>
//           <select
//             value={selectedTutor}
//             onChange={(e) => setSelectedTutor(e.target.value)}
//             className='border px-3 py-1 rounded'
//           >
//             {tutors.map((tutor) => (
//               <option key={tutor.id} value={tutor.name}>
//                 {tutor.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* 시간 선택 */}
//       <div className='grid grid-cols-3 sm:grid-cols-3 gap-2 text-sm text-gray-700 mb-4 max-h-64 overflow-y-auto'>
//         {slots.map((slot) => (
//           <TimeSlotButton
//             key={slot}
//             active={availability[selectedTutor]?.includes(slot)}
//             disabled={false}
//             onClick={() => toggleSlot(slot)}
//           >
//             {slot}
//           </TimeSlotButton>
//         ))}
//       </div>

//       {/* 저장/닫기 버튼 */}
//       <div className='flex justify-end gap-2'>
//         <button
//           onClick={closeModal}
//           className='text-gray-600 hover:underline text-sm'
//         >
//           닫기
//         </button>
//         <button
//           onClick={handleSave}
//           className='bg-blue-600 text-white px-4 py-2 rounded text-sm'
//         >
//           저장
//         </button>
//       </div>
//     </ModalLayout>
//   );
// };

// export default AvailabilityModal;
