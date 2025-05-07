"use client";

import React from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "font-semibold rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyle = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 py-2 px-4 ",
    outline:
      "border border-gray-300 bg-white text-gray-600 hover:text-black hover:border-gray-600 text-sm px-2 py-1",
  };

  const combinedClassName = `${baseStyle} ${variantStyle[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
