"use client";

import { useState } from "react";

interface Props {
  onChange: (filters: {
    search: string;
    month: string;
  }) => void;
}

const PurchaseFilter = ({ onChange }: Props) => {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");

  const applyFilters = () => {
    onChange({ search, month });
  };

  const clearFilters = () => {
    setSearch("");
    setMonth("");
    onChange({ search: "", month: "" });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-end">
      
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg"
      />

      {/* 📅 Month Only */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded-lg"
      />

      {/* ✅ Apply */}
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-3 py-2 rounded-lg"
      >
        Apply
      </button>

      {/* ♻️ Clear */}
      <button
        onClick={clearFilters}
        className="bg-gray-500 text-white px-3 py-2 rounded-lg"
      >
        Clear
      </button>
    </div>
  );
};

export default PurchaseFilter;