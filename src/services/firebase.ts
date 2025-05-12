import { Holiday } from "@/types/tutor";
import { Reservation } from "@/types/reservation";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { format, parseISO } from "date-fns";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 예약 생성
export const createReservation = async (
  reservationData: Omit<Reservation, "id" | "createdAt">
): Promise<Reservation> => {
  try {
    const todayString = new Date().toISOString().slice(0, 10);
    const docRef = await addDoc(collection(db, "reservations"), {
      ...reservationData,
      classDate: todayString,
      createdAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...reservationData,
      classDate: todayString,
      createdAt: Timestamp.now().toDate().toISOString(),
    };
  } catch (error) {
    console.error("예약 생성 오류:", error);
    throw error;
  }
};

// 예약 취소
export const cancelReservation = async (
  reservationId: string
): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "reservations", reservationId));
    return true;
  } catch (error) {
    console.error("예약 취소 오류:", error);
    throw error;
  }
};

// 예약 수정
export const updateReservation = async (
  id: string,
  updatedData: Partial<Omit<Reservation, "id" | "createdAt">>
): Promise<void> => {
  try {
    const ref = doc(db, "reservations", id);
    await updateDoc(ref, updatedData);
  } catch (error) {
    console.error("예약 수정 오류:", error);
    throw error;
  }
};

// 오늘의 예약 실시간 모니터링
export const subscribeToTodayReservations = (
  callback: (reservations: Reservation[]) => void
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reservationsQuery = query(
    collection(db, "reservations"),
    where("createdAt", ">=", Timestamp.fromDate(today)),
    where("createdAt", "<", Timestamp.fromDate(tomorrow))
  );

  return onSnapshot(reservationsQuery, (snapshot) => {
    const reservations: Reservation[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId ?? "",
        tutor: data.tutor ?? "",
        date: data.date ?? "",
        timeSlot: data.timeSlot ?? "",
        status: data.status ?? "reserved",
        teamName: data.teamName ?? "",
        question: data.question ?? "",
        resourceLink: data.resourceLink ?? "",
        classDate: data.classDate ?? "",
        editPassword: data.editPassword ?? "",
        createdAt: data.createdAt?.toDate().toISOString() ?? "",
      };
    });

    // 예약 현황 시간순 정렬
    reservations.sort((a, b) => {
      return a.timeSlot.localeCompare(b.timeSlot);
    });
    callback(reservations);
  });
};

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