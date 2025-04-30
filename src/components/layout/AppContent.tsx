"use client";

import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import ModalRenderer from "../shared/ModalRenderer";
import ReservationTabs from "../reservations/ReservationTabs";
import Header from "./Header";
import Footer from "./Footer";

const AppContent = () => {
  const { user } = useAuth();
  const isAdmin: boolean = user?.role === "admin";
  const { showModal } = useModal();

  const today: string = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className='relative max-w-5xl mx-auto px-4 py-6 font-sans bg-gray-50 min-h-screen'>
      <Header />
      <ReservationTabs isAdmin={isAdmin} />
      <Footer />
      <ModalRenderer />
    </div>
  );
};

export default AppContent;
