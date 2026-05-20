"use client";

import React, { useEffect, useState } from "react";
import { FundRecord } from "@/Interfaces/fundRecordInterface";

interface Props {
  initialData?: FundRecord;
  onSubmit: (data: FundRecord) => void;
  onClose: () => void;
  loading?: boolean; // ✅ add loading
}

const FundForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const [source, setSource] = useState(initialData?.source || "");
  const [type, setType] = useState<"IN" | "OUT">(initialData?.type || "IN");
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [date, setDate] = useState(
    initialData?.date?.slice(0, 10) ||
      new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState<
    "Investment" | "Loan" | "Expense" | "Profit" | "Others"
  >(initialData?.category || "Others");
  const [note, setNote] = useState(initialData?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
    
      source,
      type,
      amount,
      date,
      category,
      note,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      {/* Source */}
      <input
        type="text"
        placeholder="Source (e.g., Investor A)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        required
        className="border p-2 rounded"
      />

      {/* Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "IN" | "OUT")}
        className="border p-2 rounded"
      >
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
      </select>

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
        className="border p-2 rounded"
      />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <p className="text-sm text-gray-500">
        {initialData?.date && `Current: ${new Date(initialData.date).toLocaleDateString()}`}
      </p>

      {/* Category */}
      <select
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value as
              | "Investment"
              | "Loan"
              | "Expense"
              | "Profit"
              | "Others"
          )
        }
        className="border p-2 rounded"
      >
        <option value="Investment">Investment</option>
        <option value="Loan">Loan</option>
        <option value="Expense">Expense</option>
        <option value="Profit">Profit</option>
        <option value="Others">Others</option>
      </select>

      {/* Note */}
      <textarea
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Fund"
            : "Add Fund"}
        </button>
      </div>
    </form>
  );
};

export default FundForm;