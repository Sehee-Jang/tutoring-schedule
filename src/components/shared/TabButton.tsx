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
      className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
      }`}
    >
      {children}
    </button>
  );
};

export default TabButton;
