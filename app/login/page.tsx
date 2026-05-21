"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "@/lib/allApiRequest/userRequest/userRequest";
import toast from "react-hot-toast";
import Link from "next/link";
import { useUser } from "@/context/AuthContext";
import { User } from "@/interfaces/userInterface";
import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const { login } = useUser();

  // ✅ loading state
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const res = await loginUser(data.phone, data.password);

      if (!res.success) {
        throw new Error(res.message || "Login failed");
      }

      const userData = res?.data as User;

      login(userData);

      toast.success("Login successful!");

      router.push("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      // ✅ loading off
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-zinc-800 dark:text-white">
          Login
        </h1>

        <p className="text-sm text-center text-zinc-500 mt-2">
          Enter your phone and password to continue
        </p>

        {/* Form */}
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col gap-4"
          >
            {/* Phone */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                disabled={loading}
                {...register("phone", {
                  required: "Phone number is required",
                })}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />

              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-zinc-500 mt-6">
          Simple offline login system
        </p>

        <div className="w-full flex justify-center items-center">
          <Link href="/register" className="text-blue-500 hover:underline">
            Don`t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;