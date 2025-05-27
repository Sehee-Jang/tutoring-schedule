"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { fetchAvailableSlotsByDayOfWeek } from "../services/availability";
import { Tutor } from "../types/tutor";
import { Availability } from "../types/availability";
import { useTutors } from "./TutorContext";
import { getDayOfWeek } from "../utils/getDayOfWeek";
import { DAYS_OF_WEEK } from "../constants/days";

interface AvailabilityContextType {
  availability: Record<string, Record<string, string[]>>;
  updateAvailability: (
    tutorId: string,
    date: string,
    slots: string[]
  ) => Promise<void>;
}

const AvailabilityContext = createContext<AvailabilityContextType>({
  availability: {},
  updateAvailability: async () => {},
});

export const useAvailability = () => useContext(AvailabilityContext);

interface AvailabilityProviderProps {
  children: ReactNode;
}

export const AvailabilityProvider = ({
  children,
}: AvailabilityProviderProps) => {
  const [availability, setAvailability] = useState<Availability>({});
  const { tutors } = useTutors();

  // const getDayOfWeek = (date: Date): string => {
  //   const days = [
  //     "일요일",
  //     "월요일",
  //     "화요일",
  //     "수요일",
  //     "목요일",
  //     "금요일",
  //     "토요일",
  //   ];
  //   return days[date.getDay()];
  // };

  const loadAvailability = useCallback(async () => {
    if (!tutors || tutors.length === 0) {
      return;
    }

    const loadedAvailability: Record<string, Record<string, string[]>> = {};

    await Promise.all(
      tutors.map(async (tutor: Tutor) => {
        const tutorAvailability: Record<string, string[]> = {};

        for (const day of DAYS_OF_WEEK) {
          const slots = await fetchAvailableSlotsByDayOfWeek(tutor.id, day);
          tutorAvailability[day] = slots;
        }

        loadedAvailability[tutor.id] = tutorAvailability;
      })
    );

    setAvailability(loadedAvailability);
  }, [tutors]);

  useEffect(() => {
    if (tutors.length > 0) {
      loadAvailability();
    }
  }, [tutors, loadAvailability]);

  const updateAvailability = async (
    tutorId: string,
    dayOfWeek: string,
    slots: string[]
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [tutorId]: {
        ...prev[tutorId],
        [dayOfWeek]: slots,
      },
    }));
  };

  return (
    <AvailabilityContext.Provider value={{ availability, updateAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};
