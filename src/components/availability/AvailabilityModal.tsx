import { useEffect, useState } from "react";
import { useAvailability } from "../../context/AvailabilityContext";
import { useTutors } from "../../context/TutorContext";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ModalLayout from "../../components/shared/ModalLayout";
import TimeSlotButton from "../../components/shared/TimeSlotButton";
import SaveDropdown from "../tutor/time-settings/SaveDropdown";
import DayTabs from "../tutor/time-settings/DayTabs";
import { generateTimeSlots } from "../../utils/generateTimeSlots";
import { DAYS_OF_WEEK } from "../../constants/days";
import { isAdminRole } from "../../utils/roleUtils";
import {
  fetchAvailableSlotsByDayOfWeek,
  saveAvailability,
} from "../../services/availability";
import { useToast } from "../../hooks/use-toast";
import Button from "../shared/Button";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTutorId?: string;
}

const AvailabilityModal = ({
  isOpen,
  selectedTutorId,
}: AvailabilityModalProps) => {
  const { closeModal } = useModal();
  const { availability: globalAvailability, updateAvailability } =
    useAvailability();
  const { tutors } = useTutors();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = isAdminRole(user?.role);
  const isTutor = user?.role === "tutor";

  const [selectedTutor, setSelectedTutor] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("월요일");
  const [availability, setAvailability] = useState<
    Record<string, Record<string, string[]>>
  >({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const slots = generateTimeSlots();
  const { toast } = useToast();
  const [startTime] = useState<string>("09:00");
  const [endTime] = useState<string>("21:00");
  const [interval] = useState<number>(30);

  useEffect(() => {
    if (selectedTutorId) {
      setSelectedTutor(selectedTutorId);
    } else if (isTutor && user?.name) {
      setSelectedTutor(user.name);
    } else if (isAdmin && tutors.length > 0) {
      setSelectedTutor(tutors[0].id);
    }
  }, [selectedTutorId, tutors, isAdmin, isTutor, user]);

  useEffect(() => {
    if (isOpen) {
      setAvailability(globalAvailability);
    }
  }, [isOpen, globalAvailability]);

  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      const currentDaySlots = prev[selectedTutor]?.[selectedDay] || [];
      const updatedDaySlots = currentDaySlots.includes(slot)
        ? currentDaySlots.filter((s) => s !== slot)
        : [...currentDaySlots, slot];

      return {
        ...prev,
        [selectedTutor]: {
          ...prev[selectedTutor],
          [selectedDay]: updatedDaySlots,
        },
      };
    });
  };

  const handleSaveCurrent = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await saveAvailability(
        selectedTutor,
        selectedDay,
        startTime,
        endTime,
        interval,
        availability[selectedTutor]?.[selectedDay] || []
      );

      // 저장 후 최신 데이터 다시 불러오기
      const updatedSlots = await fetchAvailableSlotsByDayOfWeek(
        selectedTutor,
        selectedDay
      );

      await updateAvailability(selectedTutor, selectedDay, updatedSlots);

      // 성공
      toast({
        title: "튜터링 시간 설정이 저장되었습니다.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "저장 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      for (const day of DAYS_OF_WEEK) {
        await saveAvailability(
          selectedTutor,
          day,
          startTime,
          endTime,
          interval,
          availability[selectedTutor]?.[selectedDay] || []
        );

        // 저장 후 최신 데이터 다시 불러오기
        const updatedSlots = await fetchAvailableSlotsByDayOfWeek(
          selectedTutor,
          day
        );

        await updateAvailability(selectedTutor, day, updatedSlots);
      }

      // 성공
      toast({
        title: "튜터링 시간이 모든 요일에 저장되었습니다.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "저장 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tutorName = tutors.find((t) => t.id === selectedTutor)?.name || "";

  if (!isOpen) return null;

  return (
    <ModalLayout onClose={closeModal}>
      <h2 className='text-xl font-bold mb-4 text-blue-800'>
        {selectedTutor
          ? `${tutorName} 튜터님의 ${selectedDay} 시간 설정`
          : "튜터 가능 시간 설정"}
      </h2>

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
              <option key={tutor.id} value={tutor.id}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />

      <div className='grid grid-cols-3 sm:grid-cols-3 gap-2 text-sm text-gray-700 mb-4 max-h-64 overflow-y-auto'>
        {slots.map((slot) => (
          <TimeSlotButton
            key={slot}
            active={availability[selectedTutor]?.[selectedDay]?.includes(slot)}
            disabled={false}
            onClick={() => toggleSlot(slot)}
          >
            {slot}
          </TimeSlotButton>
        ))}
      </div>

      <div className='flex justify-end gap-2 mt-2'>
        <SaveDropdown
          open={dropdownOpen}
          onToggle={() => setDropdownOpen(!dropdownOpen)}
          onSaveCurrent={handleSaveCurrent}
          onSaveAll={handleSaveAll}
          isSaving={isSaving}
        />
        <Button variant='outline' size='md' onClick={closeModal}>
          닫기
        </Button>
      </div>
    </ModalLayout>
  );
};

export default AvailabilityModal;
