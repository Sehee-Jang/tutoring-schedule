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
    organizationId: user?.organization ?? undefined,
    trackId: user?.track ?? undefined,
    batchId: user?.batch ?? undefined,
  });

  return (
    <TutorContext.Provider value={{ tutors }}>{children}</TutorContext.Provider>
  );
};
