"use client";
import { ReactNode } from "react";

interface ModalLayoutProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalLayout = ({ children, onClose }: ModalLayoutProps) => (
  <div className='fixed inset-0 flex justify-center items-center z-50'>
    {/* 반투명 검은색 배경 */}
    <div
      className='absolute inset-0 bg-[rgba(0,0,0,0.4)]'
      onClick={onClose}
    ></div>

    {/* 모달 컨텐츠 */}
    <div className='relative bg-white rounded-xl shadow-lg max-w-lg w-full p-6'>
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
