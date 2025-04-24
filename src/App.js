import React from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";

import AppContent from "./components/layout/AppContent";
function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AvailabilityProvider>
          <ReservationProvider>
            <AppContent />
          </ReservationProvider>
        </AvailabilityProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
