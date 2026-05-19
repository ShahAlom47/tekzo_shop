"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      
      <main className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-lg p-8 text-center">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
          Offline Shop App
        </h1>

        <p className="text-sm text-zinc-500 mt-2">
          Simple management system
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
          >
            Dashboard
          </button>

        </div>

      </main>
    </div>
  );
}