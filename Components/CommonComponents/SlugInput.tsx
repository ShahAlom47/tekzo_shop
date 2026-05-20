/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface SlugInputProps {
  label?: string;
  nameField: string; // e.g. "name"
  slugField: string; // e.g. "slug"
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  error?: string;
  disabled?: boolean;
}

// 🔥 slug generator
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const SlugInput = ({
  label = "Slug",
  nameField,
  slugField,
  register,
  watch,
  setValue,
  error,
  disabled = false,
}: SlugInputProps) => {
  const nameValue = watch(nameField);
  const slugValue = watch(slugField);

  useEffect(() => {
    if (nameValue && !slugValue) {
      setValue(slugField, generateSlug(nameValue));
    }
  }, [nameValue]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type="text"
        {...register(slugField)}
        disabled={disabled}
        className={`w-full border rounded px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default SlugInput;