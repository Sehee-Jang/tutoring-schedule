import {
  collection,
  doc,
  setDoc,
  getDocs,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Holiday } from "@/types/tutor";

// 유연한 시간대 기반 요일별 가능 시간 저장
export const saveAvailability = async (
  tutorId: string,
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  intervalMinutes: number,
  activeSlots: string[]
): Promise<void> => {
  const docRef = doc(db, "availability", tutorId);

  try {
    await setDoc(
      docRef,
      {
        weeklyAvailability: {
          [dayOfWeek]: {
            startTime,
            endTime,
            interval: intervalMinutes,
            activeSlots,
          },
        },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("❌ Error saving availability:", error);
  }
};

// 날짜별 가능한 시간대 불러오기 (요일 기반)
export const fetchAvailableSlotsByDate = async (
  tutorId: string,
  dayOfWeek: string
): Promise<{ activeSlots: string[] }[]> => {
  // Firestore에서 문서 ID로 직접 불러오기
  const docRef = doc(db, "availability", tutorId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error("❌ No availability data found for tutor:", tutorId);
    return [];
  }

  if (docSnap.exists()) {
    const docData = docSnap.data();
    const weeklyAvailability = docData.weeklyAvailability || {};

    if (weeklyAvailability[dayOfWeek]) {
      return [{ activeSlots: weeklyAvailability[dayOfWeek].activeSlots }];
    }
  }

  return [];
};

// 요일 기반 시간대 로드 함수로 변경
export const fetchAvailableSlotsByDayOfWeek = async (
  tutorId: string,
  dayOfWeek: string
): Promise<string[]> => {
  try {
    // 문서 ID로 직접 접근
    const docRef = doc(collection(db, "availability"), tutorId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("❌ No availability found for tutor:", tutorId);
      return [];
    }

    const data = docSnap.data();
    const weeklyAvailability = data?.weeklyAvailability || {};
    const dayAvailability = weeklyAvailability[dayOfWeek];

    // 지정된 요일의 시간대가 존재하는지 확인
    if (dayAvailability && dayAvailability.activeSlots) {
      return dayAvailability.activeSlots;
    }

    return [];
  } catch (error) {
    console.error("❌ Error fetching slots:", error);
    return [];
  }
};

// 특정 요일의 시간대 삭제
export const deleteAvailabilityByDay = async (
  tutorId: string,
  dayOfWeek: string
) => {
  const docRef = doc(db, "availability", tutorId);
  await setDoc(
    docRef,
    {
      weeklyAvailability: {
        [dayOfWeek]: null,
      },
    },
    { merge: true }
  );
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
