"use client";

import { createUser } from "@/lib/allApiRequest/userRequest/userRequest";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  name: string;
  phone: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit =async (data: FormData)  => {
 

    // old users
    try {
      const res = await createUser(data);


      if (!res.success) {
        throw new Error(res.message || "Register failed");
      }

      toast.success("Account created successfully!");

      router.push("/login"); // redirect to login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <Toaster position="top-right" />
        <h1 className="text-center text-2xl font-bold text-zinc-800 dark:text-white">
          Register User
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone", {
                required: "Phone number is required",
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
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
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
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
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <div className="flex justify-center items-center">
          <Link href="/login" className="text-blue-500 hover:underline ">
            Already have an account? Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;