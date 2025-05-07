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
  saveTutorAvailability,
} from "@/services/firebase";

interface AvailabilityContextType {
  availability: Record<string, string[]>;
  updateAvailability: (tutor: string, slots: string[]) => Promise<void>;
}

const AvailabilityContext = createContext<AvailabilityContextType>({
  availability: {},
  updateAvailability: async () => {},
});

export const useAvailability = () => useContext(AvailabilityContext);

interface AvailabilityProviderProps {
  children: ReactNode;
}

export const AvailabilityProvider = ({ children }: AvailabilityProviderProps) => {
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllTutorAvailability();
      setAvailability(data as Record<string, string[]>);
    };
    load();
  }, []);

  const updateAvailability = async (tutor: string, slots: string[]) => {
    await saveTutorAvailability(tutor, slots);
    setAvailability((prev) => ({ ...prev, [tutor]: slots }));
  };

  return (
    <AvailabilityContext.Provider value={{ availability, updateAvailability }}>
      {children}
    </AvailabilityContext.Provider>
  );
};
