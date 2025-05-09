"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import type { Reservation } from "@/types/reservation";
import { db } from "@/services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

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
    const todayString = new Date().toISOString().slice(0, 10);

    const reservationsQuery = query(
      collection(db, "reservations"),
      orderBy("createdAt", "asc")
    );

    //  const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
    //    const fetchedReservations: Reservation[] = snapshot.docs.map((doc) => ({
    //      id: doc.id,
    //      ...doc.data(),
    //    })) as Reservation[];

    //    const todayReservations = fetchedReservations.filter(
    //      (res) => (res as any).classDate === todayString
    //    );

    //    setReservations(todayReservations);
    //    setLoading(false);
    //  });
    const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
      const fetchedReservations: Reservation[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId ?? "",
            teamName: data.teamName ?? "",
            tutor: data.tutor ?? "",
            timeSlot: data.timeSlot ?? "",
            classDate: data.classDate ?? "",
            resourceLink: data.resourceLink ?? "",
            question: data.question ?? "",
            editPassword: data.editPassword ?? "",
            date: data.date ?? todayString,
            status: data.status ?? "pending",
            createdAt: data.createdAt ?? null,
          } as Reservation;
        })
        .filter((res) => isReservation(res));

      setReservations(fetchedReservations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // 타입 가드 (Type Guard)
  const isReservation = (data: Partial<Reservation>): data is Reservation => {
    return (
      typeof data.id === "string" &&
      typeof data.userId === "string" &&
      typeof data.tutor === "string" &&
      typeof data.timeSlot === "string" &&
      typeof data.classDate === "string" &&
      typeof data.status === "string"
    );
  };

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
