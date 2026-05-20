"use client";

import React, { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        w-full
        bg-blue-900/90 text-white
        py-2.5 px-4
        rounded-xl
        font-medium
        hover:opacity-90 transition
        focus:outline-none focus:ring-2 focus:ring-black
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default PrimaryButton;