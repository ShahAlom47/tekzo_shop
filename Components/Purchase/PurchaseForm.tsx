"use client";

import { Purchase } from "@/Interfaces/purchaseInterface";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

interface Props {
  initialData?: Purchase | null;
  onSubmit: (data: Purchase) => Promise<void> | void;
}

const PurchaseForm = ({ initialData, onSubmit }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Purchase>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      memos: [{ shopName: "", memoNumber: "", amount: 0 }],
      productTotal: 0,
      transportCost: 0,
      otherCost: 0,
      grandTotal: 0,
      note: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "memos",
  });

  const memos = watch("memos");
  const transportCost = watch("transportCost") || 0;
  const otherCost = watch("otherCost") || 0;

  useEffect(() => {
    const productTotal = memos.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const grandTotal = productTotal + Number(transportCost) + Number(otherCost);

    setValue("productTotal", productTotal);
    setValue("grandTotal", grandTotal);
  }, [memos, transportCost, otherCost, setValue]);

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(key as keyof Purchase, (initialData as any)[key]);
      });
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: Purchase) => {
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit(data);

      // ✅ reset form after success (only for add)
      if (!initialData) {
        reset({
          date: new Date().toISOString().split("T")[0],
          memos: [{ shopName: "", memoNumber: "", amount: 0 }],
          productTotal: 0,
          transportCost: 0,
          otherCost: 0,
          grandTotal: 0,
          note: "",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-3 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {initialData ? "✏️ Edit Purchase" : "➕ Add Purchase"}
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date </label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-red-500 font-bold my-2">({initialData?.date ? new Date(initialData.date).toLocaleDateString() : "-"})</p>
        </div>

        {/* Memo Section */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-700">Memos</h2>
            <button
              type="button"
              onClick={() => append({ shopName: "", memoNumber: "", amount: 0 })}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              + Add
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 bg-white p-3 rounded-lg shadow-sm">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Shop Name</label>
                <input
                  placeholder="Shop Name"
                  {...register(`memos.${index}.shopName`)}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Memo No</label>
                <input
                  placeholder="Memo No"
                  {...register(`memos.${index}.memoNumber`, { required: true })}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="Amount"
                  {...register(`memos.${index}.amount`, { valueAsNumber: true })}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white rounded-lg w-full h-[42px]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Costs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Transport Cost</label>
            <input
              type="number"
              placeholder="Transport Cost"
              {...register("transportCost", { valueAsNumber: true })}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Other Cost</label>
            <input
              type="number"
              placeholder="Other Cost"
              {...register("otherCost", { valueAsNumber: true })}
              className="border p-2 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Totals */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Product Total</label>
            <input
              type="number"
              {...register("productTotal")}
              readOnly
              className="border p-2 rounded-lg bg-gray-100 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Grand Total</label>
            <input
              type="number"
              {...register("grandTotal")}
              readOnly
              className="border p-2 rounded-lg bg-gray-100 w-full"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Note</label>
          <textarea
            placeholder="Note"
            {...register("note")}
            className="border p-2 rounded-lg w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-xl font-semibold text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
            ? "Update Purchase"
            : "Save Purchase"}
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;
