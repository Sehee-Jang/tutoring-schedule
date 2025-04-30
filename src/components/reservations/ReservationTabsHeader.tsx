"use client";

import { Reservation } from "../../types/reservation";
import { useTutors } from "../../context/TutorContext";
import TutorButton from "../shared/TutorButton";

interface ReservationTabsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reservations: Reservation[];
}

const ReservationTabsHeader = ({
  activeTab,
  setActiveTab,
  reservations,
}: ReservationTabsHeaderProps) => {
  const { tutors } = useTutors();

  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      <button
        onClick={() => setActiveTab("all")}
        className={`px-4 py-1 rounded-full text-sm font-medium ${
          activeTab === "all"
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        전체 예약
      </button>
      {tutors.map((tutor) => {
        const count = reservations.filter(
          (r: Reservation) => r.tutor === tutor.name
        ).length;
        return (
          <TutorButton
            key={tutor.id}
            selected={activeTab === tutor.name}
            onClick={() => setActiveTab(tutor.name)}
          >
            {tutor.name} <span className='text-xs font-bold'>{count}</span>
          </TutorButton>
        );
      })}
    </div>
  );
};

export default ReservationTabsHeader;
