import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import SignUpModal from "@/components/auth/SignUpModal";
import AvailabilityModal from "@/components/availability/AvailabilityModal";
import ReservationDetailModal from "@/components/reservations/ReservationDetailModal";

const ModalRenderer = () => {
  const { modalType, modalProps, closeModal } = useModal();
  const { isAdmin, isTutor } = useAuth();

  if (!modalType) return null;

  switch (modalType) {
    case "login":
      return <LoginModal />;
    case "signup":
      return <SignUpModal />;
    case "availability":
      return <AvailabilityModal />;
    case "reservationDetail":
      return (
        <ReservationDetailModal
          isOpen={true}
          reservation={modalProps?.reservation || null}
          onClose={closeModal}
          isAdmin={isAdmin}
          isTutor={isTutor}
        />
      );
    default:
      return null;
  }
};

export default ModalRenderer;
