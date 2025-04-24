import React, { useState } from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import ReservationStatus from "./components/ReservationStatus";
import ReservationForm from "./components/ReservationForm";
import AvailabilityModal from "./components/AvailabilityModal";

function App() {
  const [user, setUser] = useState({ name: "관리자", role: "admin" });
  const [showAvailability, setShowAvailability] = useState(false);
  const isAdmin = user?.role === "admin";

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <AvailabilityProvider>
      <ReservationProvider>
        <div className='max-w-5xl mx-auto px-4 py-6 font-sans bg-gray-50 min-h-screen'>
          <header className='text-center mb-10'>
            <h1 className='text-3xl font-bold text-gray-800'>
              튜터링 예약 시스템
            </h1>
            <p className='text-lg text-gray-500 mt-2'>
              오늘: {today}
              {user?.role === "admin" && (
                <span className='ml-2 text-sm text-green-600'>(관리자)</span>
              )}
              {isAdmin && (
                <button
                  onClick={() => setShowAvailability(true)}
                  className='mb-4 bg-blue-500 text-white px-4 py-2 rounded'
                >
                  튜터 시간 설정
                </button>
              )}
            </p>
          </header>

          <ReservationStatus isAdmin={user?.role === "admin"} />
          <AvailabilityModal
            isOpen={showAvailability}
            onClose={() => setShowAvailability(false)}
          />
          <ReservationForm />
        </div>
      </ReservationProvider>
    </AvailabilityProvider>
  );
}

export default App;
