"use client";
import { Outlet } from "react-router-dom";
import ModalRenderer from "../shared/ModalRenderer";
import ReservationTabs from "../reservations/ReservationTabs";
import Header from "./Header";
import Footer from "./Footer";

const AppContent = () => {
  return (
    <div className='relative min-h-screen font-sans'>
      <Header />

      <main className='pt-6'>
        <Outlet />
      </main>

      <Footer />
      <ModalRenderer />
    </div>
  );
};

export default AppContent;
