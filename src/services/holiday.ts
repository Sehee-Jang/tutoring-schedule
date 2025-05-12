import { Holiday } from "@/types/tutor";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// 휴무일 저장 (개별 문서)
export const saveTutorHoliday = async (
  tutorID: string,
  startDate: string,
  endDate: string,
  reason: string
) => {
  const docRef = await addDoc(collection(db, "holidays"), {
    tutorID,
    startDate,
    endDate,
    reason,
  });
  return docRef.id;
};

export const fetchTutorHolidays = async (tutorID: string) => {
  const q = query(collection(db, "holidays"), where("tutorID", "==", tutorID));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Holiday[];
};

// 특정 휴무일 삭제
export const deleteTutorHoliday = async (id: string) => {
  await deleteDoc(doc(db, "holidays", id));
};

// 휴무일 수정
export const updateTutorHoliday = async (
  holidayID: string,
  updatedData: Partial<{ startDate: string; endDate: string; reason: string }>
) => {
  const ref = doc(db, "holidays", holidayID);
  await updateDoc(ref, updatedData);
};
