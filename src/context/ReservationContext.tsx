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
import { Reservation } from "../types/reservation";

interface ReservationContextType {
  reservations: Reservation[];
  loading: boolean;
  isTimeSlotBooked: (tutor: string, timeSlot: string) => boolean;
}

const ReservationContext = createContext<ReservationContextType>({
  reservations: [],
  loading: true,
  isTimeSlotBooked: () => false, // 기본값
});

export const useReservations = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "reservations"));
        const initialReservations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Reservation, "id">),
        }));
        setReservations(initialReservations);
        setLoading(false);

        // 실시간 업데이트 시작
        onSnapshot(collection(db, "reservations"), (snapshot) => {
          const liveReservations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Reservation, "id">),
          }));
          setReservations(liveReservations);
        });
      } catch (error) {
        console.error("예약 초기 로딩 실패:", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // ✅ 추가: 시간대가 예약되었는지 확인하는 함수
  const isTimeSlotBooked = (tutor: string, timeSlot: string) => {
    return reservations.some(
      (res) => res.tutor === tutor && res.timeSlot === timeSlot
    );
  };

  return (
    <ReservationContext.Provider
      value={{ reservations, loading, isTimeSlotBooked }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
