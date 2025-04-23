import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.TUTORING_SCHEDULE_FIREBASE_API_KEY,
  authDomain: process.env.TUTORING_SCHEDULE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.TUTORING_SCHEDULE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.TUTORING_SCHEDULE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.TUTORING_SCHEDULE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.TUTORING_SCHEDULE_FIREBASE_APP_ID,
  measurementId: process.env.TUTORING_SCHEDULE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 예약 생성
export const createReservation = async (reservationData) => {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...reservationData,
      createdAt: Timestamp.now(),
      date: Timestamp.fromDate(new Date()),
    });
    return { id: docRef.id, ...reservationData };
  } catch (error) {
    console.error("예약 생성 오류:", error);
    throw error;
  }
};

// 예약 취소
export const cancelReservation = async (reservationId) => {
  try {
    await deleteDoc(doc(db, "reservations", reservationId));
    return true;
  } catch (error) {
    console.error("예약 취소 오류:", error);
    throw error;
  }
};

// 오늘의 예약 실시간 모니터링
export const subscribeToTodayReservations = (callback) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reservationsQuery = query(
    collection(db, "reservations"),
    where("date", ">=", Timestamp.fromDate(today)),
    where("date", "<", Timestamp.fromDate(tomorrow))
  );

  return onSnapshot(reservationsQuery, (snapshot) => {
    const reservations = [];
    snapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() });
    });
    callback(reservations);
  });
};

export default db;
