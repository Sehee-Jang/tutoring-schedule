"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import type { Reservation } from "@/types/reservation";
import { subscribeToTodayReservations } from "../services/firebase";

// Context 타입 정의
interface ReservationContextType {
  reservations: Reservation[];
  loading: boolean;
  getTutorReservations: (tutorName: string) => Reservation[];
  isTimeSlotBooked: (tutor: string, timeSlot: string) => boolean;
}

const ReservationContext = createContext<ReservationContextType>({
  reservations: [],
  loading: true,
  getTutorReservations: () => [],
  isTimeSlotBooked: () => false,
});

export const useReservations = () => useContext(ReservationContext);

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider = ({ children }: ReservationProviderProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToTodayReservations(
      (newReservations: Reservation[]) => {
        setReservations(newReservations);
        setLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  // 특정 튜터의 예약만 필터링
  const getTutorReservations = (tutorName: string): Reservation[] => {
    return reservations.filter((res) => res.tutor === tutorName);
  };

  // 특정 시간대가 예약되었는지 확인
  const isTimeSlotBooked = (tutor: string, timeSlot: string): boolean => {
    return reservations.some(
      (res) => res.tutor === tutor && res.timeSlot === timeSlot
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        getTutorReservations,
        isTimeSlotBooked,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
