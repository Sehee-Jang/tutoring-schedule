"use client";

import React from "react";

interface TimeSlotButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  disabled: boolean;
  children: React.ReactNode;
}

const TimeSlotButton = ({
  active,
  disabled,
  children,
  ...props
}: TimeSlotButtonProps) => {
  const base =
    "w-32 text-center rounded-lg border border-gray-200 px-4 py-2 text-sm transition disabled:cursor-not-allowed";
  const activeClass = "bg-blue-600 text-white";
  const disabledClass = "bg-gray-100 text-gray-400";
  const defaultClass = "bg-white hover:bg-gray-50";

  let className = base;
  if (disabled) className += ` ${disabledClass}`;
  else if (active) className += ` ${activeClass}`;
  else className += ` ${defaultClass}`;

  return (
    <button type='button' {...props} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

export default TimeSlotButton;
