// 전역 모달 상태 관리
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Modal 타입 정의
type ModalType =
  | "login"
  | "signup"
  | "availability"
  | "reservationDetail"
  | null;

interface ModalContextType {
  modalType: ModalType;
  modalProps: Record<string, unknown> | null;
  isOpen: boolean;
  showModal: (type: ModalType, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  modalType: null,
  modalProps: null,
  isOpen: false,
  showModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

// ModalProviderProps 타입 정의
interface ModalProviderProps {
  children: ReactNode;
}

// ModalProvider 컴포넌트
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalType, setModalType] = useState<ModalType>(null); // 'login' | 'availability' | 'reservationDetail'
  const [modalProps, setModalProps] = useState<Record<string, unknown> | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const showModal = (type: ModalType, props?: Record<string, unknown>) => {
    setModalType(type);
    setModalProps(props || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, isOpen, showModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
