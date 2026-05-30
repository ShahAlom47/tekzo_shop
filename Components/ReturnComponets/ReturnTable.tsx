"use client";

import React from "react";

type Props = {
  refresh: boolean;
};

const ReturnTable = ({ refresh }: Props) => {
  // future: API fetch using refresh

  const data = [
    {
      saleNumber: "S-1001",
      product: "Mouse",
      qty: 1,
      amount: 500,
      note: "Defective",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-bold mb-3">Return History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Sale</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Note</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{item.saleNumber}</td>
                <td className="border p-2">{item.product}</td>
                <td className="border p-2">{item.qty}</td>
                <td className="border p-2">{item.amount}</td>
                <td className="border p-2">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnTable;