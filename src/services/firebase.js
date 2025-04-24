import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const db = getFirestore(app);
const auth = getAuth(app);

// 예약 생성
export const createReservation = async (reservationData) => {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...reservationData,
      createdAt: Timestamp.now(),
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

// 예약 수정
export const updateReservation = async (id, updatedData) => {
  try {
    const ref = doc(db, "reservations", id);
    await updateDoc(ref, updatedData);
  } catch (error) {
    console.error("예약 수정 오류:", error);
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
    where("createdAt", ">=", Timestamp.fromDate(today)),
    where("createdAt", "<", Timestamp.fromDate(tomorrow))
  );

  return onSnapshot(reservationsQuery, (snapshot) => {
    const reservations = [];
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

// 튜터 가능 시간 저장
export const saveTutorAvailability = async (tutor, slots) => {
  const ref = doc(db, "availability", tutor);
  await setDoc(ref, { tutor, slots });
};

// 모든 튜터 가능 시간 가져오기
export const fetchAllTutorAvailability = async () => {
  const q = query(collection(db, "availability"));
  const snapshot = await getDocs(q);
  const data = {};
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data().slots;
  });
  return data;
};

export { db, auth };
