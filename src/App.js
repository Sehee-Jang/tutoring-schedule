import React, { useState } from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import ReservationStatus from "./components/ReservationStatus";
import ReservationForm from "./components/ReservationForm";
import AvailabilityModal from "./components/AvailabilityModal";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";

function App() {
  const { user } = useAuth();
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
      <AuthProvider>
        <ReservationProvider>
          <div className='...'>
            <header className='...'>
              <h1>튜터링 예약 시스템</h1>
              <p>오늘: {today}</p>
              {user ? (
                <p className='text-sm text-green-600'>
                  {user.name}님, 환영합니다 ({user.role})
                </p>
              ) : null}
            </header>

            {!user ? (
              <LoginForm />
            ) : (
              <>
                {isAdmin && (
                  <button
                    onClick={() => setShowAvailability(true)}
                    className='mb-4 bg-blue-500 text-white px-4 py-2 rounded'
                  >
                    튜터 시간 설정
                  </button>
                )}

                <ReservationStatus isAdmin={isAdmin} />
                <AvailabilityModal
                  isOpen={showAvailability}
                  onClose={() => setShowAvailability(false)}
                />
                <ReservationForm />
              </>
            )}
          </div>
        </ReservationProvider>
      </AuthProvider>
    </AvailabilityProvider>
  );
}

export default App;
