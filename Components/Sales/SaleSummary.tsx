"use client";

import { SalesSummary } from "@/interfaces/saleInterfaces";
import React from "react";


interface Props {
  summary?: SalesSummary;
  loading?: boolean;
}

const SaleSummary: React.FC<Props> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total Sales",
      value: summary?.totalSales || 0,
      icon: <p> </p>,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Revenue",
      value: summary?.totalRevenue || 0,
      icon:<p> </p>,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Paid",
      value: summary?.totalPaid || 0,
      icon: <p> </p>,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Due",
      value: summary?.totalDue || 0,
      icon:<p> </p>,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Profit",
      value: summary?.totalProfit || 0,
      icon: <p> </p>,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Top */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{item.label}</span>
            <div
              className={`p-2 rounded-full ${item.color}`}
            >
              {item.icon}
            </div>
          </div>

          {/* Value */}
          <div className="text-2xl font-bold text-gray-800">
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
          </div>

          {/* Small hint */}
          <div className="text-xs text-gray-400 mt-1">
            Overview
          </div>
        </div>
      ))}
    </div>
  );
};

export default SaleSummary;