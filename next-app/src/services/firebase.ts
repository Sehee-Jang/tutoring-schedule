"use client";

import { Holiday } from "@/types/tutor";
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
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 예약 생성
export const createReservation = async (
  reservationData: Record<string, any>
) => {
  try {
    const todayString = new Date().toISOString().slice(0, 10);
    const docRef = await addDoc(collection(db, "reservations"), {
      ...reservationData,
      classDate: todayString,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...reservationData, classDate: todayString };
  } catch (error) {
    console.error("예약 생성 오류:", error);
    throw error;
  }
};

// 예약 취소
export const cancelReservation = async (reservationId: string) => {
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
  updatedData: Record<string, any>
) => {
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
  callback: (reservations: any[]) => void
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
    const reservations: any[] = [];
    snapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() });
    });

    // 예약 현황 시간순 정렬
    reservations.sort((a, b) => {
      return a.timeSlot.localeCompare(b.timeSlot);
    });
    callback(reservations);
  });
};

// 튜터 가능 시간 저장 (날짜별)
// export const saveTutorAvailability = async (
//   tutorId: string,
//   date: string,
//   slots: string[]
// ) => {
//   const ref = doc(collection(db, "availability"));
//   await setDoc(ref, {
//     tutorId,
//     date,
//     slots,
//   });
// };

// 반복 스케줄 기반 가능 시간 저장
export const saveAvailability = async (
  tutorId: string,
  repeatType: string,
  repeatDays: string[],
  startDate: string,
  endDate: string,
  slots: string[]
) => {
  const docRef = doc(collection(db, "availability")); // 모듈 방식으로 수정

  await setDoc(docRef, {
    tutorId: tutorId, // 튜터의 고유 ID로 저장
    repeatType: repeatType,
    repeatDays: repeatDays,
    startDate: startDate,
    endDate: endDate,
    slots: slots,
    createdAt: Timestamp.now(), // 생성 시간 추가 (optional)
  });
};

// 날짜별 가능한 시간대 불러오기 (반복 스케줄 적용)
export const fetchAvailableSlotsByDate = async (
  tutorId: string,
  date: string
): Promise<
  { id: string; repeatType: string; repeatDays: string[]; slots: string[] }[]
> => {
  const availabilityRef = collection(db, "availability");
  const q = query(availabilityRef, where("tutorId", "==", tutorId));
  const querySnapshot = await getDocs(q);

  const results: {
    id: string;
    repeatType: string;
    repeatDays: string[];
    slots: string[];
  }[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const startDate = data.startDate;
    const endDate = data.endDate || startDate;

    // 매일 반복
    if (data.repeatType === "daily") {
      if (!endDate || (date >= startDate && date <= endDate)) {
        results.push({
          id: doc.id,
          repeatType: "매일",
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
          repeatType: "매주",
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
          repeatType: "매월",
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

// 모든 튜터 가능 시간 가져오기
// export const fetchAllTutorAvailability = async () => {
//   const q = query(collection(db, "availability"));
//   const snapshot = await getDocs(q);
//   const data: Record<string, Record<string, string[]>> = {};
//   console.log("📌 fetchAllTutorAvailability: ", data);

//   snapshot.forEach((doc) => {
//     const availability = doc.data();
//     const tutorId = availability.tutorId;
//     const startDate = parseISO(availability.startDate);
//     const endDate = availability.endDate
//       ? parseISO(availability.endDate)
//       : startDate;
//     const slots = availability.slots || [];
//     const repeatType = availability.repeatType;
//     const repeatDays = availability.repeatDays || [];

//     if (!data[tutorId]) {
//       data[tutorId] = {};
//     }

//     // data[tutorId][date] = slots;
//     if (repeatType === "none") {
//       // 단일 날짜 (반복 없음)
//       const dateStr = format(startDate, "yyyy-MM-dd");
//       data[tutorId][dateStr] = slots;
//     } else if (repeatType === "daily") {
//       // 매일 반복
//       eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
//         const dateStr = format(date, "yyyy-MM-dd");
//         if (!data[tutorId][dateStr]) {
//           data[tutorId][dateStr] = [...slots];
//         }
//       });
//     } else if (repeatType === "weekly") {
//       // 매주 반복 (요일 지정)
//       eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
//         const dayOfWeek = format(date, "EEEE");
//         if (repeatDays.includes(dayOfWeek)) {
//           const dateStr = format(date, "yyyy-MM-dd");
//           if (!data[tutorId][dateStr]) {
//             data[tutorId][dateStr] = [...slots];
//           }
//         }
//       });
//     } else if (repeatType === "monthly") {
//       // 매월 반복 (일자 기준)
//       eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
//         if (format(date, "dd") === format(startDate, "dd")) {
//           const dateStr = format(date, "yyyy-MM-dd");
//           if (!data[tutorId][dateStr]) {
//             data[tutorId][dateStr] = [...slots];
//           }
//         }
//       });
//     }
//   });
//   console.log("✅ fetchAllTutorAvailability (정상):", data);
//   return data;
// };

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

// 휴무일 저장
// export const saveTutorHolidays = async (
//   tutor: string,
//   holidays: { startDate: string; endDate: string; reason: string }[]
// ) => {
//   const ref = doc(db, "holidays", tutor);
//   await setDoc(ref, { holidays });
// };

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

// 특정 튜터의 모든 휴무일 불러오기
// export const fetchTutorHolidays = async (tutor: string) => {
//   const ref = doc(db, "holidays", tutor);
//   const snapshot = await getDoc(ref);
//   if (snapshot.exists()) {
//     return snapshot.data().holidays || [];
//   }
//   return [];
// };

export const fetchTutorHolidays = async (tutorID: string) => {
  const q = query(collection(db, "holidays"), where("tutorID", "==", tutorID));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Holiday[];
};

// 특정 휴무일 삭제
// export const deleteTutorHolidays = async (
//   tutor: string,
//   idToDelete: string
// ) => {
//   const ref = doc(db, "holidays", tutor);
//   const snapshot = await getDoc(ref);
//   if (snapshot.exists()) {
//     const current = snapshot.data().holidays || [];
//     const updated = current.filter((h: any) => h.id !== idToDelete);
//     await setDoc(ref, { tutor, holidays: updated });
//   }
// };
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

export { db, auth };
