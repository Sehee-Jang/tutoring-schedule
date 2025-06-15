import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppContent from "./components/layout/AppContent";
import AdminRoute from "./components/common/AdminRoute";
import ModalRenderer from "./components/shared/ModalRenderer";
import Providers from "./Providers";
import LoginPage from "./components/auth/LoginPage";
import CreateAdminPage from "./pages/admin/createAdmin";
import SignUpRoleSelectionPage from "./pages/signup/SignUpRoleSelectionPage";
import AdminSignUpPage from "./pages/signup/AdminSignUpPage";
import TutorSignUpPage from "./pages/signup/TutorSignUpPage";

import ManageTutor from "./pages/admin/ManageTutor";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservationStatusForTutor from "./components/tutor/reservation/ReservationStatusForTutor";
import TimeSettingsPanel from "./components/tutor/time-settings/TimeSettingsPanel";
import AdminLayout from "./pages/admin/AdminLayout";
import TutorLayout from "./pages/tutor/TutorLayout";
import ManageTrackPage from "./pages/admin/ManageTrackPage";
import ManageBatchePage from "./pages/admin/ManageBatchePage";
import ManageReservations from "./pages/admin/ManageReservations";
import ManageOrganizationPage from "./pages/admin/ManageOrganizationPage";
import AdminSettingsPage from "./pages/admin/settings/AdminSettingsPage";
import ManageManagersPage from "./pages/admin/ManageManagersPage";

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path='/' element={<AppContent />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin/signup' element={<CreateAdminPage />} />
          <Route path='/signup' element={<SignUpRoleSelectionPage />} />
          <Route path='/signup/admin' element={<AdminSignUpPage />} />
          <Route path='/signup/tutor' element={<TutorSignUpPage />} />

          {/* 관리자 라우터 */}
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to='managers' replace />} />
            <Route path='managers' element={<ManageManagersPage />} />
            <Route path='tutors' element={<ManageTutor />} />
            <Route path='organizations' element={<ManageOrganizationPage />} />
            <Route path='tracks' element={<ManageTrackPage />} />
            <Route path='batches' element={<ManageBatchePage />} />
            <Route path='reservations' element={<ManageReservations />} />
            <Route path='/admin/settings' element={<AdminSettingsPage />} />
          </Route>

          {/* 튜터 라우터 */}
          <Route
            path='/tutor/*'
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <TutorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to='reservations' replace />} />
            <Route
              path='reservations'
              element={<ReservationStatusForTutor />}
            />
            <Route path='time-settings' element={<TimeSettingsPanel />} />
          </Route>
        </Routes>
        <ModalRenderer />
      </Router>
    </Providers>
  );
};

export default App;
