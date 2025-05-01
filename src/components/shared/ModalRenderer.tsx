import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../auth/LoginModal";
import SignUpModal from "../auth/SignUpModal";
import AvailabilityModal from "../availability/AvailabilityModal";
import ReservationDetailModal from "../reservations/ReservationDetailModal";

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
