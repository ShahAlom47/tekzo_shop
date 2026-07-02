"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Logout from "../CommonComponents/Logout";
import StoreNavbar from "../CommonComponents/Navbar";

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg transition hover:bg-gray-100"
        >
          <span className="h-0.5 w-5 rounded-full bg-gray-700"></span>
          <span className="h-0.5 w-5 rounded-full bg-gray-700"></span>
          <span className="h-0.5 w-5 rounded-full bg-gray-700"></span>
        </button>

        <div className="font-semibold text-lg">Dashboard</div>

        <div className="w-10" />
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:shadow-md`}
      >
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-4 text-white">
          <h2 className="mt-2 text-center text-xl font-bold">TekzoBD</h2>
          <p className="mt-1 text-center text-sm text-indigo-100">
            Business Management System
          </p>

          {/* Mobile Close */}
          <div className="mt-4 flex justify-center md:hidden">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/30 px-4 py-1 text-sm hover:bg-white/10"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <StoreNavbar />
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          <Logout />

          <div className="mt-4 border-t pt-3 text-center text-xs text-gray-400">
            Version 1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
