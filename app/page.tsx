"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const  user = true  // 🔥 Fix hydration error

  // 🔥 IMPORTANT FIX
  // if (loading) {
  //   return null; // or spinner
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      
      <main className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-lg p-8 text-center">
        
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
          Offline Shop App
        </h1>

        <p className="text-sm text-zinc-500 mt-2">
          Simple management system
        </p>

        {/* User status */}
        {user && (
          <p className="mt-4 text-sm text-green-600">
            {/* Logged in as: {user.name} */}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4">

          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => {
              if (!user) router.push("/login");
              else router.push("/dashboard");
            }}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
          >
            Dashboard
          </button>

          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Logout
            </button>
          )}

        </div>

      </main>
    </div>
  );
}