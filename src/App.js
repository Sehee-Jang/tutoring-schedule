import React from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import AppContent from "./components/AppContent";
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
