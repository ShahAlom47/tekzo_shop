"use client";

import {
  expenseCategoryOptions,
  Expense,
  ExpenseFormType,
} from "@/Interfaces/expensesInterface";
import {
  addExpenses,
  editExpenses,
} from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  initialData?: Expense | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditExpenseForm = ({ initialData ,setOpenModal}: Props) => {
  const queryClient = useQueryClient();

  const getDefaultForm = () => ({
    title: "",
    amount: 0,
    category: "others",
    note: "",
    expenseDate: new Date().toISOString().split("T")[0],
  } as ExpenseFormType & { expenseDate: string });

  const [form, setForm] = useState<
    ExpenseFormType & { expenseDate: string }
  >(getDefaultForm());

  const [loading, setLoading] = useState(false);

  // 🔥 autofill (edit) + reset (add)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount || 0,
        category: initialData.category || "others",
        note: initialData.note || "",
        expenseDate:
          initialData.expenseDate?.split("T")[0] ||
          getDefaultForm().expenseDate,
      });
    } else {
      setForm(getDefaultForm());
    }
  }, [initialData]);

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
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const isEdit = !!initialData;

      const payload = {
        ...form,
        expenseDate: new Date(form.expenseDate).toISOString(),
      };

      let res;

      if (isEdit) {
        const id = initialData?._id?.toString();

        if (!id) {
          toast.error("Invalid expense ID");
          return;
        }

        res = await editExpenses(id, payload);
      } else {
        res = await addExpenses(payload);
      }

      if (!res?.success) {
        toast.error(res?.message || "Operation failed");
        return;
      }

      toast.success(
        isEdit ? "Expense updated successfully" : "Expense added successfully"
      );

      // 🔥 refetch
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      setOpenModal(false);

      // 🔥 reset only for add
      if (!isEdit) {
        setForm(getDefaultForm());
      }
    } catch (err) {
      console.error(err);
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

      {/* Date */}
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
        value={form.note}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-400"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Expense"
          : "Add Expense"}
      </button>
    </form>
  );
};

export default EditExpenseForm;