import { useModal } from "../../context/ModalContext";
import LoginModal from "../auth/LoginModal";
import AvailabilityModal from "../availability/AvailabilityModal";
import ReservationDetailModal from "../reservations/ReservationDetailModal";

const ModalRenderer = () => {
  const { modalType, modalProps, closeModal } = useModal();

  if (!modalType) return null;

  switch (modalType) {
    case "login":
      return <LoginModal isOpen={true} onClose={closeModal} />;
    case "availability":
      return <AvailabilityModal isOpen={true} onClose={closeModal} />;
    case "reservationDetail":
      return (
        <ReservationDetailModal
          isOpen={true}
          reservation={modalProps?.reservation || null}
          onClose={closeModal}
          isAdmin={modalProps?.isAdmin || false}
        />
      );
    default:
      return null;
  }
};

export default ModalRenderer;
