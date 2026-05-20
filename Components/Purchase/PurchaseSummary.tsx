"use client";

import {  PurchaseSummaryType } from "@/Interfaces/purchaseInterface";

interface Props {
  summary: PurchaseSummaryType;
}

const PurchaseSummary = ({ summary }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="p-3 bg-white rounded shadow">
        <p className="text-sm text-gray-500">Total Product</p>
        <h2 className="font-bold">{summary.totalProduct}</h2>
      </div>

      <div className="p-3 bg-white rounded shadow">
        <p className="text-sm text-gray-500">Transport</p>
        <h2 className="font-bold">{summary.totalTransport}</h2>
      </div>

      <div className="p-3 bg-white rounded shadow">
        <p className="text-sm text-gray-500">Other Cost</p>
        <h2 className="font-bold">{summary.totalOther}</h2>
      </div>

      <div className="p-3 bg-white rounded shadow">
        <p className="text-sm text-gray-500">Grand Total</p>
        <h2 className="font-bold text-green-600">
          {summary.grandTotal}
        </h2>
      </div>

    </div>
  );
};

export default PurchaseSummary;