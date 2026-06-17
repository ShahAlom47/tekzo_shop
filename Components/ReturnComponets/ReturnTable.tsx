"use client";

import { getAllReturn } from "@/lib/allApiRequest/returnRequest/returnRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { DashPaginationButton } from "../CommonComponents/DashPaginationButton";
import { Return } from "@/interfaces/returnInterface";
import { CustomTable } from "../CommonComponents/CustomTable";

type Props = {
  refresh: boolean;
};

const ReturnTable = ({ refresh }: Props) => {
  const [page, setPage] = useState(1);
  const limit = 30;

  const { data, isLoading } = useQuery({
    queryKey: ["returns", page, refresh],
    queryFn: async () => {
      return await getAllReturn({
        currentPage: page,
        limit,
      });
    },
    placeholderData: (prev) => prev,
  });
console.log(data);
  if (isLoading) return <p>Loading...</p>;

  const returnData = (data?.data as Return[]) || [];
  const totalPages = data?.totalPages || 1;

const columns = [
  { header: "Sale No", accessor: "saleNumber" },
  { header: "Products", accessor: "products" },
  { header: "Qty", accessor: "totalQuantity" },
  { header: "Amount", accessor: "totalAmount" },
  { header: "Profit", accessor: "totalProfit" },
  { header: "Note", accessor: "note" },
  { header: "Date", accessor: "createdAt" },
  { header: "Action", accessor: "action" },
];
const tableData = returnData.map((item) => ({
  saleNumber: item.saleNumber || "N/A",

  products: (
    <div className="flex flex-col">
      {item.products.map((product, index) => (
        <span key={index}>
          {product.productName} ({product.quantity})
        </span>
      ))}
    </div>
  ),

  totalQuantity: <span className="font-medium">{item.totalQuantity}</span>,

  totalAmount: (
    <span className="text-red-600 font-medium">
      {item.totalAmount} TK
    </span>
  ),

  totalProfit: (
    <span
      className={
        item.totalProfit >= 0
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {item.totalProfit} TK
    </span>
  ),

  note: item.note || "-",

  createdAt: item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB")
    : "N/A",

  action: (
    <div className="flex gap-3">
      <a
        href={`/dashboard/returns/${item._id}`}
        className="text-blue-600 hover:underline"
      >
        Edit
      </a>

      {/* Delete Button */}
      {/* <DeleteReturnButton id={item._id as string} /> */}
    </div>
  ),
}));

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-bold mb-3">Return History</h2>

      <CustomTable columns={columns} data={tableData} />

      <DashPaginationButton
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        className="mt-4"
      />
    </div>
  );
};

export default ReturnTable;