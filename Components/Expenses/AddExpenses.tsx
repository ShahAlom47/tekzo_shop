"use client";

import {
  expenseCategoryOptions,
  ExpenseFormType,
} from "@/Interfaces/expensesInterface";
import { addExpenses } from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
}

const AddExpenseForm = ({ onSuccess }: Props) => {
  const [form, setForm] = useState<
    ExpenseFormType & { expenseDate: string }
  >({
    title: "",
    amount: 0,
    category: "others",
    note: "",
    expenseDate: new Date().toISOString().split("T")[0], // 🔥 default today
  });

  const [loading, setLoading] = useState(false);

  // 🔹 handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // 🔹 submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || form.amount <= 0 || !form.expenseDate) {
      toast.error("সব তথ্য ঠিকভাবে পূরণ করো");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        expenseDate: new Date(form.expenseDate).toISOString(), // 🔥 ISO convert
      };

      const res = await addExpenses(payload);

      if (!res?.success) {
        toast.error(res?.message || "Failed");
        return;
      }

      toast.success(res?.message || "Expense added");

      // reset form
      setForm({
        title: "",
        amount: 0,
        category: "others",
        note: "",
        expenseDate: new Date().toISOString().split("T")[0],
      });

      onSuccess();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      {/* Amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      {/* 🔥 Date */}
      <input
        type="date"
        name="expenseDate"
        value={form.expenseDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      {/* Category */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        {expenseCategoryOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Note */}
      <input
        type="text"
        name="note"
        placeholder="Note (optional)"
        value={form.note || ""}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;