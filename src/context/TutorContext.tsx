"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { db } from "../services/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Tutor } from "../types/tutor";

interface TutorContextType {
  tutors: Tutor[];
}

const TutorContext = createContext<TutorContextType>({ tutors: [] });

export const useTutors = () => useContext(TutorContext);

export const TutorProvider = ({ children }: { children: ReactNode }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tutors"));
        const initialTutors = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Tutor, "id">),
        }));
        setTutors(initialTutors);

        // 실시간 업데이트 시작
        onSnapshot(collection(db, "tutors"), (snapshot) => {
          const liveTutors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Tutor, "id">),
          }));
          setTutors(liveTutors);
        });
      } catch (error) {
        console.error("튜터 초기 로딩 실패:", error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <TutorContext.Provider value={{ tutors }}>{children}</TutorContext.Provider>
  );
};
