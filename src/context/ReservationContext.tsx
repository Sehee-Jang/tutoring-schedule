"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import type { Reservation } from "../types/reservation";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

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

/**
 * 💥 기존 Provider: 오늘 예약만
 */
export const ReservationProvider = ({ children }: ReservationProviderProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const todayString = new Date().toISOString().slice(0, 10);

    const reservationsQuery = query(
      collection(db, "reservations"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
      const fetchedReservations: Reservation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];

      const todayReservations = fetchedReservations.filter(
        (res) => (res as any).classDate === todayString
      );

      setReservations(todayReservations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTutorReservations = (tutorName: string) =>
    reservations.filter((res) => res.tutor === tutorName);

  const isTimeSlotBooked = (tutor: string, timeSlot: string) =>
    reservations.some(
      (res) => res.tutor === tutor && res.timeSlot === timeSlot
    );

  return (
    <ReservationContext.Provider
      value={{ reservations, loading, getTutorReservations, isTimeSlotBooked }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

/**
 * 🏫 학생용 Provider (오늘 예약)
 */
export const StudentReservationProvider = ({
  children,
}: ReservationProviderProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayString = new Date().toISOString().slice(0, 10);

    const reservationsQuery = query(
      collection(db, "reservations"),
      where("classDate", "==", todayString),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
      const fetchedReservations: Reservation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];

      setReservations(fetchedReservations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTutorReservations = (tutorName: string) =>
    reservations.filter((res) => res.tutor === tutorName);

  const isTimeSlotBooked = (tutor: string, timeSlot: string) =>
    reservations.some(
      (res) => res.tutor === tutor && res.timeSlot === timeSlot
    );

  return (
    <ReservationContext.Provider
      value={{ reservations, loading, getTutorReservations, isTimeSlotBooked }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

/**
 * 🧑‍🏫 튜터용 Provider (선택한 날짜 예약)
 */
export const TutorReservationProvider = ({
  children,
  selectedDate,
}: ReservationProviderProps & { selectedDate: string }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedDate) return;
    console.log("selectedDate for query:", selectedDate);

    const reservationsQuery = query(
      collection(db, "reservations"),
      where("classDate", "==", selectedDate),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
      const fetchedReservations: Reservation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];

      setReservations(fetchedReservations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const getTutorReservations = (tutorName: string) =>
    reservations.filter((res) => res.tutor === tutorName);

  const isTimeSlotBooked = (tutor: string, timeSlot: string) =>
    reservations.some(
      (res) => res.tutor === tutor && res.timeSlot === timeSlot
    );

  return (
    <ReservationContext.Provider
      value={{ reservations, loading, getTutorReservations, isTimeSlotBooked }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
