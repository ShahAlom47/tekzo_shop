/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AllTimeSummary from "@/Components/Summary/AllTimeSummary";
import SummaryCards from "@/Components/Summary/SummaryCards";
import SummaryHeader from "@/Components/Summary/SummaryHeader";
import SummaryTable from "@/Components/Summary/SummaryTable";
import { exportCSV } from "@/lib/export/exportCSV";

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


 const handleExport = () => {
  const rows = [
    {
      Month: "OVERALL",
      Sales: overall.totalSales,
      Profit: overall.totalProfit,
      Quantity: overall.totalQuantity,
      "Profit %": overall.profitMargin,
      Expense: overall.expense,
      "Actual Profit": overall.actualProfit,
      Collection: overall.collection,
      Due: overall.due,
      Purchase: overall.stockBuy,
      Remaining: overall.remainingAmount,
    },

    // Empty row
    {
      Month: "",
      Sales: "",
      Profit: "",
      Quantity: "",
      "Profit %": "",
      Expense: "",
      "Actual Profit": "",
      Collection: "",
      Due: "",
      Purchase: "",
      Remaining: "",
    },

    ...monthly.map((item: any) => ({
      Month: item.monthName,
      Sales: item.totalSales,
      Profit: item.totalProfit,
      Quantity: item.totalQuantity,
      "Profit %": item.profitMargin,
      Expense: item.expense,
      "Actual Profit": item.actualProfit,
      Collection: item.collection,
      Due: item.due,
      Purchase: item.stockBuy,
      Remaining: item.remainingAmount,
    })),
  ];

  exportCSV(`Summary-${year}`, rows);
};

  return (
    <div className="p-5 space-y-6">
      {/* Header */}

      <AllTimeSummary />

      <SummaryHeader
        year={year}
        currentYear={currentYear}
        onYearChange={setYear}
      ></SummaryHeader>

      {isLoading && <div>Loading...</div>}

      {error && <div className="text-red-500">{(error as Error).message}</div>}

      {!isLoading && !error && (
        <>
          {/* Overall Summary */}

          <SummaryCards overall={overall} />

          {/* Monthly Summary */}
          <button
            onClick={handleExport}
            className="border rounded-md px-4 py-2"
          >
            Export CSV
          </button>
          <SummaryTable monthly={monthly} />
        </>
      )}
    </div>
  );
};

export default Summary;
