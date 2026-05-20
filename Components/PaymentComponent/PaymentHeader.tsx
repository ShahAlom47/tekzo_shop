"use client";

import React from "react";

interface Props {

  month: string;
  setMonth: (val: string) => void;

  totalAmount: number;

  clearFilters: () => void;
}

const PaymentHeader: React.FC<Props> = ({

  month,
  setMonth,
  totalAmount,
  clearFilters,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        
      

        {/* Month Filter */}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm"
        >
          Clear
        </button>
      </div>

      {/* 🔹 Total Amount */}
      <div className="text-right">
        <p className="text-sm text-gray-500">Total Payment</p>
        <h2 className="text-xl font-semibold text-green-600">
          ৳ {totalAmount.toLocaleString()}
        </h2>
      </div>
    </div>
  );
};

export default PaymentHeader;