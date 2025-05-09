"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Tutor } from "@/types/tutor";
import { useFetchTutors } from "@/hooks/useFetchTutors";

interface TutorContextType {
  tutors: Tutor[];
}

const TutorContext = createContext<TutorContextType>({ tutors: [] });

export const useTutors = () => useContext(TutorContext);

interface TutorProviderProps {
  children: ReactNode;
}

export const TutorProvider = ({ children }: TutorProviderProps) => {
  // const [tutors, setTutors] = useState<Tutor[]>([]);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "tutors"), (snapshot) => {
  //     const liveTutors = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...(doc.data() as Omit<Tutor, "id">),
  //     }));
  //     setTutors(liveTutors);
  //   });

  //   return () => unsubscribe();
  // }, []);
  const { tutors } = useFetchTutors();
  return (
    <TutorContext.Provider value={{ tutors }}>{children}</TutorContext.Provider>
  );
};
