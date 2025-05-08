"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  fetchAllTutorAvailability,
  fetchAvailableSlotsByDate,
  saveTutorAvailability,
} from "@/services/firebase";
import { Tutor } from "@/types/tutor";
import { Availability } from "@/types/availability";
import { useTutors } from "./TutorContext";

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

export const AvailabilityProvider = ({children}: AvailabilityProviderProps) => {
  const [availability, setAvailability] = useState<Availability>({});
  const { tutors } = useTutors();

  const loadAvailability = async () => {
    if (!tutors || tutors.length === 0) return; // 튜터가 없는 경우 처리
    
    const today = new Date().toISOString().split("T")[0];
    const loadedAvailability: Record<string, Record<string, string[]>> = {};

    await Promise.all(
      tutors.map(async (tutor: Tutor) => {
        const slots = await fetchAvailableSlotsByDate(tutor.id, today);
        loadedAvailability[tutor.id] = {
          [today]: slots.flatMap((item) => item.slots),
        };
      })
    );

    setAvailability(loadedAvailability);
    console.log("✅ 실시간 반영된 튜터 가능 시간:", loadedAvailability);
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const updateAvailability = async (
    tutorId: string,
    date: string,
    slots: string[]
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [tutorId]: {
        ...prev[tutorId],
        [date]: slots,
      },
    }));
  };
  return (
    <AvailabilityContext.Provider value={{ availability, updateAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};
