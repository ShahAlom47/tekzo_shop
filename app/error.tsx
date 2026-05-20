"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  homeBtn?: boolean;
  reloadBtn?: boolean;
}
const ErrorPage = ({ homeBtn, reloadBtn }: ErrorPageProps) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] text-black flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Oops! Text with Image Fill using inline style */}
      <div
        className="text-[100px] md:text-[140px]  text-black font-extrabold text-center"
     
      >
        Oops!
      </div>

      {/* 404 Text */}
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        404 - PAGE NOT FOUND
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        The page you are looking for might have been removed,
        <br />
        had its name changed or is temporarily unavailable.
      </p>

      <div className="flex gap-4">
        {homeBtn !== false && (
          <button onClick={handleGoHome} className="btn-base rounded-full w-10 h-10 p-2">
            Home
          </button>
        )}
        {reloadBtn !== false && (
          <button onClick={() => router.refresh()} className="btn-bordered  rounded-full w-10 h-10 p-2">
            Reload
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
