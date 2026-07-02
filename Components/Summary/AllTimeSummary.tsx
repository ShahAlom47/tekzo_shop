"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const AllTimeSummary = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary-all"],
    queryFn: async () => {
      const res = await fetch("/api/summary/all");

      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }

      return res.json();
    },

    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const overall = data?.data?.overall;

  return (
    <div className="space-y-4">

      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {open ? "Hide All Time Summary" : "Show All Time Summary"}
      </button>

      {open && (
        <div className="border rounded-lg p-5">

          {isLoading && <p>Loading...</p>}

          {error && (
            <p className="text-red-500">
              {(error as Error).message}
            </p>
          )}

          {!isLoading && !error && overall && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Sales</p>
                <p className="font-bold">{overall.totalSales}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Profit</p>
                <p className="font-bold">{overall.totalProfit}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Expense</p>
                <p className="font-bold">{overall.expense}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Actual Profit</p>
                <p className="font-bold">{overall.actualProfit}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Collection</p>
                <p className="font-bold">{overall.collection}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Due</p>
                <p className="font-bold">{overall.due}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Purchase</p>
                <p className="font-bold">{overall.stockBuy}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-bold">{overall.totalQuantity}</p>
              </div>

              <div className="border rounded p-3">
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="font-bold">{overall.remainingAmount}</p>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AllTimeSummary;