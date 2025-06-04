import { Outlet } from "react-router-dom";
import Sidebar from "../../components/tutor/shared/Sidebar";
import TutorHeader from "../../components/tutor/shared/TutorHeader";
import { useState } from "react";
import { format } from "date-fns";
import { TutorReservationProvider } from "../../context/ReservationContext";

const TutorLayout = () => {
  const [date, setDate] = useState(new Date());
  const selectedDate = format(date, "yyyy-MM-dd");
  return (
    <TutorReservationProvider selectedDate={selectedDate}>
      <div className='flex flex-col h-screen bg-gray-50 px-8 py-6 gap-10'>
        <TutorHeader />
        <div className='flex flex-1 bg-gray-50 gap-5'>
          <aside className='w-[190px] border border-gray-200 bg-white rounded-xl'>
            <Sidebar />
          </aside>
          <main className='flex-1 overflow-y-auto p-6 border border-gray-200 bg-white rounded-xl'>
            <Outlet context={{ date, setDate }} />
          </main>
        </div>
      </div>
    </TutorReservationProvider>
  );
};

export default TutorLayout;
