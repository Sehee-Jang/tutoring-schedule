import React from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import { TutorProvider } from "./context/TutorContext";
import { HolidayProvider } from "./context/HolidayContext";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <ModalProvider>
          <HolidayProvider>
            <AvailabilityProvider>
              <ReservationProvider>
                <TutorProvider>{children}</TutorProvider>
              </ReservationProvider>
            </AvailabilityProvider>
          </HolidayProvider>
        </ModalProvider>
      </AuthProvider>
      <ToastProvider />
      <Toaster />
    </>
  );
};

export default Providers;
