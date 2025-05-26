// 전역에서 모든 모달 관리
import { useModal } from "../../context/ModalContext";
import LoginModal from "../../components/auth/LoginModal";
import SignUpModal from "../../components/auth/SignUpModal";
import AvailabilityModal from "../../components/availability/AvailabilityModal";
import ReservationDetailModal from "../../components/reservations/ReservationDetailModal";
import type { Reservation } from "../../types/reservation";

const ModalRenderer = () => {
  const { modalType, modalProps, closeModal } = useModal();

  return (
    <>
      {modalType === "login" && <LoginModal isOpen onClose={closeModal} />}
      {modalType === "signup" && <SignUpModal isOpen onClose={closeModal} />}
      {modalType === "availability" && (
        <AvailabilityModal
          isOpen
          onClose={closeModal}
          selectedTutorId={modalProps?.selectedTutorId}
        />
      )}

      {modalType === "reservationDetail" && (
        <ReservationDetailModal
          isOpen
          onClose={closeModal}
          reservation={modalProps?.reservation as Reservation | null}
          isAdmin={Boolean(modalProps?.isAdmin)}
          isTutor={Boolean(modalProps?.isTutor)}
        />
      )}
    </>
  );
};

export default ModalRenderer;
