"use client";


import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "./QueryProvider";

export default function RootProvider({ children }: { children: ReactNode }) {
  return (

        <QueryProvider>
          <AuthProvider>
          <Toaster position="top-right" />
          
          {children}
          </AuthProvider>
        </QueryProvider>
  
  );
}
