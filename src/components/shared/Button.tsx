"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "warning" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "font-semibold rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyle = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400",
    outline:
      "border border-gray-300 bg-white text-gray-600 hover:text-black hover:border-gray-600",
    warning: "bg-red-600 hover:bg-red-700 text-white",
    icon: "text-gray-700 hover:text-black",
  };

  const sizeStyle = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClassName = `${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
