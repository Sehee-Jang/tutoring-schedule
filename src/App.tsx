import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import AppContent from "./components/layout/AppContent";
import AdminPage from "./pages/admin/tutors";
import { TutorProvider } from "./context/TutorContext";
import AdminRoute from "./components/common/AdminRoute";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import SignUpForm from "./components/auth/SignUpForm";
import TutorPage from "./pages/tutor/page";
import ModalRenderer from "./components/shared/ModalRenderer";

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <ModalProvider>
          <AvailabilityProvider>
            <ReservationProvider>
              <TutorProvider>
                <Router>
                  <Routes>
                    <Route path='/' element={<AppContent />} />
                    <Route
                      path='/admin/tutors'
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                    <Route path='/tutor' element={<TutorPage />} />
                  </Routes>
                </Router>
                <ModalRenderer />
              </TutorProvider>
            </ReservationProvider>
          </AvailabilityProvider>
        </ModalProvider>
      </AuthProvider>
      <ToastProvider />
      <Toaster />
    </>
  );
};

export default App;
