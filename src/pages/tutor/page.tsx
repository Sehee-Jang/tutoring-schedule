"use client";

import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ProtectedRoute from "../../components/ProtectedRoute";
// import { useNavigate } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import TutorLayout from "./TutorLayout";
import { useState } from "react";
import TimeSettingsPanel from "../../components/tutor/time-settings/TimeSettingsPanel";
import ReservationStatusForTutor from "../../components/tutor/reservation/ReservationStatusForTutor";

const TutorPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"timeSettings" | "reservations">(
    "reservations"
  );

  // user === null이면 로그인 하도록 유도
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return (
    <ProtectedRoute allowedRoles={["tutor"]}>
      <TutorLayout setViewMode={setViewMode} viewMode={viewMode}>
        {viewMode === "reservations" ? (
          <ReservationStatusForTutor />
        ) : (
          <TimeSettingsPanel />
        )}
      </TutorLayout>
    </ProtectedRoute>
  );
};

export default TutorPage;
