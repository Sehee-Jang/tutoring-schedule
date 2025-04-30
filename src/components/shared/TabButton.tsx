"use client";

import React from "react";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-1/2 px-6 py-2 text-sm font-semibold rounded-xl transition
        ${
          isActive
            ? "bg-white text-blue-600 shadow-sm"
            : "bg-transparent text-gray-400 hover:text-blue-500"
        }
      `}
    >
      {children}
    </button>
  );
};

export default TabButton;
