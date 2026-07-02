/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AllTimeSummary from "@/Components/Summary/AllTimeSummary";

const Summary = () => {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const { data, isLoading, error } = useQuery({
    queryKey: ["summary", year],
    queryFn: async () => {
      const res = await fetch(`/api/summary?year=${year}`);

      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }

      return res.json();
    },
  });

  const overall = data?.data?.overall;
  const monthly = data?.data?.monthly ?? [];

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
         <AllTimeSummary />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Summary ({year})</h1>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded-md px-3 py-2 outline-none"
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* <button className="border px-2 py-1 rounded-sm" onClick={() => setOpenAllTime(!openAllTime)}>
          {openAllTime ? "Hide All Time Summary" : "Show All Time Summary"}
        </button> */}
      </div>

      {isLoading && <div>Loading...</div>}

      {error && <div className="text-red-500">{(error as Error).message}</div>}

      {!isLoading && !error && (
        <>
       
          {/* Overall Summary */}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Sales</p>
              <p className="font-bold">{overall?.totalSales}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Profit</p>
              <p className="font-bold">{overall?.totalProfit}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Expense</p>
              <p className="font-bold">{overall?.expense}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Actual Profit</p>
              <p className="font-bold">{overall?.actualProfit}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Collection</p>
              <p className="font-bold">{overall?.collection}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Due</p>
              <p className="font-bold">{overall?.due}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Purchase</p>
              <p className="font-bold">{overall?.stockBuy}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-bold">{overall?.totalQuantity}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="font-bold">{overall?.remainingAmount}</p>
            </div>
          </div>

          {/* Monthly Summary */}

          <div className="overflow-x-auto">
            <table className="w-full border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Month</th>
                  <th className="border p-2">Sales</th>
                  <th className="border p-2">Profit</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Profit %</th>
                  <th className="border p-2">Expense</th>
                  <th className="border p-2">Actual Profit</th>
                  <th className="border p-2">Collection</th>
                  <th className="border p-2">Due</th>
                  <th className="border p-2">Purchase</th>
                  <th className="border p-2">Remaining</th>
                </tr>
              </thead>

              <tbody>
                {monthly.map((item: any) => (
                  <tr key={item.month}>
                    <td className="border p-2">{item.monthName}</td>
                    <td className="border p-2">{item.totalSales}</td>
                    <td className="border p-2">{item.totalProfit}</td>
                    <td className="border p-2">{item.totalQuantity}</td>
                    <td className="border p-2">{item.profitMargin}%</td>
                    <td className="border p-2">{item.expense}</td>
                    <td className="border p-2">{item.actualProfit}</td>
                    <td className="border p-2">{item.collection}</td>
                    <td className="border p-2">{item.due}</td>
                    <td className="border p-2">{item.stockBuy}</td>
                    <td className="border p-2">{item.remainingAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;
