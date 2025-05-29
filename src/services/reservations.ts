import { Reservation } from "@/types/reservation";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { formatInTimeZone } from "date-fns-tz";

// 예약 생성
export const createReservation = async (
  reservationData: Omit<Reservation, "id" | "createdAt">
): Promise<Reservation> => {
  try {
    const timeZone = "Asia/Seoul";
    const now = new Date();
    const todayString = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
    console.log("🔥 한국 시간 기준 todayString:", todayString);

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
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);

  const today = new Date(kstNow);

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
