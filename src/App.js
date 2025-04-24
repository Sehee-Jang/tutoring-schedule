import React, { useState } from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ReservationStatus from "./components/ReservationStatus";
import ReservationForm from "./components/ReservationForm";
import AvailabilityModal from "./components/AvailabilityModal";
import LoginModal from "./components/LoginModal";

const AppContent = () => {
  const { user } = useAuth();
  const [showAvailability, setShowAvailability] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const isAdmin = user?.role === "admin";

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className='max-w-5xl mx-auto px-4 py-6 font-sans bg-gray-50 min-h-screen'>
      <header className='text-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>
            튜터링 예약 시스템
          </h1>
          <p className='text-sm text-gray-500'>오늘: {today}</p>
        </div>
        <div>
          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              className='text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500'
            >
              로그인
            </button>
          ) : (
            <span className='text-sm text-green-600'>
              {user.name}님 로그인됨
            </span>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

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
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AvailabilityProvider>
        <ReservationProvider>
          <AppContent />
        </ReservationProvider>
      </AvailabilityProvider>
    </AuthProvider>
  );
}

export default App;
