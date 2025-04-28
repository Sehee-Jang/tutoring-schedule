import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { ReservationProvider } from "./context/ReservationContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import AppContent from "./components/layout/AppContent";
import TutorsPage from "./pages/admin/TutorsPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <AvailabilityProvider>
          <ReservationProvider>
            <Router>
              <Routes>
                <Route path='/' element={<AppContent />} />
                <Route path='/admin/tutors' element={<TutorsPage />} />
              </Routes>
            </Router>
          </ReservationProvider>
        </AvailabilityProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
