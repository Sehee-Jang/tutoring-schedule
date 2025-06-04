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

import ManageTutor from "./pages/admin/ManageTutor";
import ManageOrganizations from "./pages/admin/ManageOrganizations";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservationStatusForTutor from "./components/tutor/reservation/ReservationStatusForTutor";
import TimeSettingsPanel from "./components/tutor/time-settings/TimeSettingsPanel";
import AdminLayout from "./pages/admin/AdminLayout";
import TutorLayout from "./pages/tutor/TutorLayout";
import ManageTracks from "./pages/admin/ManageTracks";
import ManageBatches from "./pages/admin/ManageBatches";
import ManageReservations from "./pages/admin/ManageReservations";
import OrganizationDashboardPage from "./pages/admin/organization-manage";
import OrganizationsManagePage from "./pages/admin/organization-manage";
import AdminSettingsPage from "./pages/admin/settings/AdminSettingsPage";

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path='/' element={<AppContent />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin/signup' element={<CreateAdminPage />} />

          {/* 관리자 라우터 */}
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to='tutors' replace />} />
            <Route path='tutors' element={<ManageTutor />} />
            <Route path='organizations' element={<OrganizationsManagePage />} />
            <Route path='tracks' element={<ManageTracks />} />
            <Route path='batches' element={<ManageBatches />} />
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
