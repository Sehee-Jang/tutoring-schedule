import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null); // 'login' | 'availability' | 'reservationDetail'
  const [modalProps, setModalProps] = useState(null);

  const showModal = (type, props = null) => {
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

export const useModal = () => useContext(ModalContext);
