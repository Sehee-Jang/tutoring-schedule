"use client";

import ModalRenderer from "@/components/shared/ModalRenderer";
import ReservationTabs from "@/components/reservations/ReservationTabs";
import Header from "./Header";
import Footer from "./Footer";

const AppContent = () => {
  return (
    <div className='relative max-w-5xl mx-auto px-4 py-6 font-sans bg-gray-50 min-h-screen'>
      <Header />
      <ReservationTabs />
      <Footer />
      <ModalRenderer />
    </div>
  );
};

export default AppContent;
