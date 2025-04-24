import React from "react";

const ModalLayout = ({ children, onClose }) => (
  <div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
    <div className='bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative'>
      {children}
      <button
        onClick={onClose}
        className='absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl'
      >
        &times;
      </button>
    </div>
  </div>
);

export default ModalLayout;
