"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { Tutor } from "../types/tutor";

interface TutorContextType {
  tutors: Tutor[];
}

const TutorContext = createContext<TutorContextType>({ tutors: [] });

export const useTutors = () => useContext(TutorContext);

export const TutorProvider = ({ children }: { children: ReactNode }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tutors"), (snapshot) => {
      const tutorList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Tutor, "id">),
      }));
      setTutors(tutorList); // ✅ 필터링 없이 전체 tutors 저장
    });

    return () => unsubscribe();
  }, []);

  return (
    <TutorContext.Provider value={{ tutors }}>{children}</TutorContext.Provider>
  );
};
