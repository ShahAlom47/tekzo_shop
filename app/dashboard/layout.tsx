"use client";

import SideBar from "@/Components/Sidebar/SideBar";
import { useUser } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading,} = useUser();

  if (loading) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <div className="min-h-screen flex-col flex md:flex-row   bg-white border-4 border-gray-500 rounded-md text-black">
      <SideBar />
      <main className="flex-1 p-4 max-h-screen overflow-scroll">{children}</main>
    </div>
  );
}
