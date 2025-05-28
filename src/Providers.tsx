import React from "react";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { StudentReservationProvider } from "./context/ReservationContext";
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
          <TutorProvider>
            <HolidayProvider>
              <AvailabilityProvider>
                <StudentReservationProvider>
                  {children}
                </StudentReservationProvider>
              </AvailabilityProvider>
            </HolidayProvider>
          </TutorProvider>
        </ModalProvider>
      </AuthProvider>
      <ToastProvider />
      <Toaster />
    </>
  );
};

export default Providers;
