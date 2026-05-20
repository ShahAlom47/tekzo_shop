"use client";

import {
  ExpenseCategory,
  expenseCategoryOptions,
} from "@/Interfaces/expensesInterface";
import { useState } from "react";

interface GetExpensesParams {
  searchTrim?: string;
  category?: ExpenseCategory;
  month?: string; // format: YYYY-MM
}

interface Props {
  onFilterChange: (filters: Partial<GetExpensesParams>) => void;
  totalAmount?: number; // 🔥 show total
}

export default function ExpenseFilter({
  onFilterChange,
  totalAmount,
}: Props) {
  const [filters, setFilters] = useState<Partial<GetExpensesParams>>({
    searchTrim: "",
    category: undefined,
    month: "",
  });

  const handleChange = (
    field: keyof GetExpensesParams,
    value: string
  ) => {
    const updated = {
      ...filters,
      [field]: value || undefined,
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetData: Partial<GetExpensesParams> = {};
    setFilters(resetData);
    onFilterChange(resetData);
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex flex-col gap-4">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.searchTrim || ""}
            onChange={(e) =>
              handleChange("searchTrim", e.target.value)
            }
            className="border px-4 py-2 rounded-xl text-sm"
          />

          {/* Category */}
          <select
            value={filters.category || ""}
            onChange={(e) =>
              handleChange("category", e.target.value)
            }
            className="border px-4 py-2 rounded-xl text-sm"
          >
            <option value="">All Categories</option>
            {expenseCategoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Month */}
          <input
            type="month"
            value={filters.month || ""}
            onChange={(e) =>
              handleChange("month", e.target.value)
            }
            className="border px-4 py-2 rounded-xl text-sm"
          />
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center">

          {/* 🔥 Total Expense */}
          <p className="text-lg font-medium">
            Total: <span className="text-blue-600 font-bold">
              ৳ {totalAmount || 0}
            </span>
          </p>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm border rounded-xl hover:bg-black hover:text-white"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}