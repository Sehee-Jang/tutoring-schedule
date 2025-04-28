import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import AppContent from "./components/layout/AppContent";
import TutorsPage from "./pages/admin/TutorsPage";
import { TutorProvider } from "./context/TutorContext";
import AdminRoute from "./components/common/AdminRoute";
import { Toaster } from "react-hot-toast";

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
                          <TutorsPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </Router>
              </TutorProvider>
            </ReservationProvider>
          </AvailabilityProvider>
        </ModalProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
};

export default App;
