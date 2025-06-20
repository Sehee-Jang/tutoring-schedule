"use client";

import { createContext, useContext, ReactNode } from "react";
import { Tutor } from "../types/tutor";
import { useFetchTutors } from "../hooks/useFetchTutors";
import { useAuth } from "../context/AuthContext";

interface TutorContextType {
  tutors: Tutor[];
}

const TutorContext = createContext<TutorContextType>({ tutors: [] });

export const useTutors = () => useContext(TutorContext);

interface TutorProviderProps {
  children: ReactNode;
}

export const TutorProvider = ({ children }: TutorProviderProps) => {
  const { user } = useAuth();

  const { tutors } = useFetchTutors({
    role: user?.role ?? "",
    organizationId: user?.organizationId ?? undefined,
    trackId: user?.trackId ?? undefined,
    batchIds: user?.batchIds ?? undefined,
  });

  return (
    <TutorContext.Provider value={{ tutors }}>{children}</TutorContext.Provider>
  );
};
