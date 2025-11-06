// src/App.tsx
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppContent from "./components/layout/AppContent";
import ModalRenderer from "./components/shared/ModalRenderer";
import Providers from "./Providers";

/** ===== lazy routes (필요할 때만 네트워크 로드) ===== */
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const CompleteProfilePage = lazy(
  () => import("./pages/auth/CompleteProfilePage")
);
const PendingApprovalPage = lazy(
  () => import("./pages/auth/PendingApprovalPage")
);

const ReservationPage = lazy(() => import("./pages/reservation/page"));
const ReservationStatusPage = lazy(() => import("./pages/status/page"));
const MyPage = lazy(() => import("./pages/mypage/page"));

const AdminRoute = lazy(() => import("./components/common/AdminRoute"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const ManageManagersPage = lazy(
  () => import("./pages/admin/ManageManagersPage")
);
const ManageTutor = lazy(() => import("./pages/admin/ManageTutor"));
const ManageOrganizationPage = lazy(
  () => import("./pages/admin/ManageOrganizationPage")
);
const ManageTrackPage = lazy(() => import("./pages/admin/ManageTrackPage"));
const ManageBatchePage = lazy(() => import("./pages/admin/ManageBatchePage"));
const ManageReservations = lazy(
  () => import("./pages/admin/ManageReservations")
);
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));

const TutorLayout = lazy(() => import("./pages/tutor/TutorLayout"));
const ReservationStatusForTutor = lazy(
  () => import("./components/tutor/reservation/ReservationStatusForTutor")
);
const TimeSettingsPanel = lazy(
  () => import("./components/tutor/time-settings/TimeSettingsPanel")
);
const TutorProfilePage = lazy(() => import("./pages/tutor/TutorProfilePage"));

// 심플한 로더 (원하면 스켈레톤/스피너 컴포넌트로 교체 가능)
const Fallback = () => <div style={{ padding: 16 }}>Loading…</div>;

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* ====== Public Layout (공통 헤더/푸터) ====== */}
            <Route path='/' element={<AppContent />}>
              {/* / → /reservation 으로 리다이렉트 */}
              <Route index element={<Navigate to='reservation' replace />} />
              <Route path='reservation' element={<ReservationPage />} />
              <Route path='status' element={<ReservationStatusPage />} />
              <Route path='mypage' element={<MyPage />} />
            </Route>

            {/* ====== Auth Pages (레이아웃 밖) ====== */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/complete-profile' element={<CompleteProfilePage />} />
            <Route path='/pending-approval' element={<PendingApprovalPage />} />

            {/* ====== Admin Layout ====== */}
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
              <Route
                path='organizations'
                element={<ManageOrganizationPage />}
              />
              <Route path='tracks' element={<ManageTrackPage />} />
              <Route path='batches' element={<ManageBatchePage />} />
              <Route path='reservations' element={<ManageReservations />} />
              <Route path='settings' element={<AdminSettingsPage />} />
            </Route>

            {/* ====== Tutor Layout ====== */}
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
              <Route path='profile-settings' element={<TutorProfilePage />} />
            </Route>
          </Routes>
        </Suspense>

        <ModalRenderer />
      </Router>
    </Providers>
  );
};

export default App;
