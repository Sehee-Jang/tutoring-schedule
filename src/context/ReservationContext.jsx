import React, { createContext, useState, useEffect, useContext } from "react";
import { subscribeToTodayReservations } from "../services/firebase";

const ReservationContext = createContext();

export const useReservations = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = subscribeToTodayReservations((newReservations) => {
        console.log("🔥 예약 현황 업데이트됨", newReservations); // 이거 찍히는지 확인
        setReservations(newReservations);
        setLoading(false);
      });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  // 특정 튜터의 예약만 필터링
  const getTutorReservations = (tutorName) => {
    return reservations.filter((res) => res.tutor === tutorName);
  };

  // 특정 시간대가 예약되었는지 확인
  const isTimeSlotBooked = (tutor, timeSlot) => {
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
