"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "login" | "availability" | "reservationDetail" | null;

interface ModalContextType {
  modalType: ModalType;
  modalProps: any;
  showModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  modalType: null,
  modalProps: null,
  showModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalType, setModalType] = useState<ModalType>(null); // 'login' | 'availability' | 'reservationDetail'
  const [modalProps, setModalProps] = useState<any>(null);

  const showModal = (type: ModalType, props: any = null) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, showModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
