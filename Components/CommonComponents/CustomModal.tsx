"use client";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const CustomModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: CustomModalProps) => {

  // ESC key close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // scroll lock
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  ">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-xl shadow-lg w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12  2xl:w-4/12 max-h-[95vh] overflow-y-scroll p-4 ${className}`}
      >
        {(title || description) && (
          <div className="mb-4 ">
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}

        {children}

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
        <Toaster position="top-right" />
    </div>
  );
};

export default CustomModal;