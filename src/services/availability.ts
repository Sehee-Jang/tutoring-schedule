import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { format, parseISO } from "date-fns";
import { db } from "./firebase";
import { Holiday } from "@/types/tutor";

// 반복 스케줄 기반 가능 시간 저장
export const saveAvailability = async (
  tutorId: string,
  repeatType: "none" | "daily" | "weekly" | "monthly",
  repeatDays: string[],
  startDate: string,
  endDate: string,
  slots: string[]
): Promise<void> => {
  const docRef = doc(collection(db, "availability")); // 모듈 방식으로 수정

  await setDoc(docRef, {
    tutorId,
    repeatType,
    repeatDays,
    startDate,
    endDate,
    slots,
    createdAt: Timestamp.now(),
  });
};

// 날짜별 가능한 시간대 불러오기
interface AvailableSlot {
  id: string;
  repeatType: "none" | "daily" | "weekly" | "monthly";
  repeatDays: string[];
  slots: string[];
}

// 날짜별 가능한 시간대 불러오기 (반복 스케줄 적용)
export const fetchAvailableSlotsByDate = async (
  tutorId: string,
  date: string
): Promise<AvailableSlot[]> => {
  const availabilityRef = collection(db, "availability");
  const q = query(availabilityRef, where("tutorId", "==", tutorId));
  const querySnapshot = await getDocs(q);

  const results: AvailableSlot[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const startDate = data.startDate;
    const endDate = data.endDate || startDate;

    // 매일 반복
    if (data.repeatType === "daily") {
      if (!endDate || (date >= startDate && date <= endDate)) {
        results.push({
          id: doc.id,
          repeatType: "daily",
          repeatDays: [],
          slots: data.slots,
        });
      }
    }
    // 매주 반복
    else if (
      data.repeatType === "weekly" &&
      data.repeatDays.includes(format(parseISO(date), "EEEE"))
    ) {
      if (!endDate || (date >= startDate && date <= endDate)) {
        results.push({
          id: doc.id,
          repeatType: "weekly",
          repeatDays: data.repeatDays,
          slots: data.slots,
        });
      }
    }
    // 매월 반복
    else if (
      data.repeatType === "monthly" &&
      format(parseISO(date), "dd") === format(parseISO(startDate), "dd")
    ) {
      if (!endDate || (date >= startDate && date <= endDate)) {
        results.push({
          id: doc.id,
          repeatType: "monthly",
          repeatDays: [],
          slots: data.slots,
        });
      }
    }
    // 단일 날짜 (반복 없음)
    else if (data.repeatType === "none" && date === startDate) {
      results.push({
        id: doc.id,
        repeatType: "none",
        repeatDays: [],
        slots: data.slots,
      });
    }
  });

  return results;
};

// 특정 시간대 삭제 (반복 설정에 따른 시간대)
export const deleteAvailabilityById = async (docId: string) => {
  const docRef = doc(db, "availability", docId);
  await deleteDoc(docRef);
};

// 모든 튜터의 휴무일 가져오기
export const fetchAllTutorHolidays = async (): Promise<Holiday[]> => {
  const snapshot = await getDocs(collection(db, "holidays"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    tutorID: doc.data().tutorID,
    startDate: doc.data().startDate,
    endDate: doc.data().endDate,
    reason: doc.data().reason,
  })) as Holiday[];
};
