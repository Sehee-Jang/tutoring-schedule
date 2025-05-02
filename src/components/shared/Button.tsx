"use client";

import React from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const PrimaryButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyle = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400",
    outline:
      "border border-gray-300 bg-white text-gray-800 hover:text-black hover:border-gray-600",
  };

  const combinedClassName = `${baseStyle} ${variantStyle} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
