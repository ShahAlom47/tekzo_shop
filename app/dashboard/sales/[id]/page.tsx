"use client";

import SaleProductTable from "@/Components/Sales/SaleProductTable";
import { useCustomer } from "@/hook/useCustomer";
import {  SaleProduct } from "@/Interfaces/saleInterfaces";
import { getSaleById } from "@/lib/allApiRequest/salesRequest/salesRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";



export interface SaleDetailsType {
  _id: string;
  saleNumber?: string;
  customerId?: string;

  createdAt?: string;

  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  discount?: number;

  paidAmount?: number;
  dueAmount?: number;

  products?: SaleProduct[];
}

const SaleDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  // 🔹 Sale Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sale", id],
    queryFn: async () => {
      const res = await getSaleById(id);
      return res;
    },
    enabled: !!id,
  });

  const sale = data?.data as SaleDetailsType ;



  const customerId = sale?.customerId || '' ;

  // 🔹 Customer Query (only when sale exists)
  const { data: customer, isLoading: customerLoading } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Sale Details...
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load sale details
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sale Details</h1>
          <p className="text-gray-500">
            Sale Number: {sale.saleNumber ?? "N/A"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">
            {sale.createdAt
              ? new Date(sale.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* CUSTOMER + PAYMENT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CUSTOMER */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-3">Customer</h2>

          {sale.customerId ? (
            <div className="text-gray-700">
              <p>Customer ID: {sale.customerId}</p>

              <p className="text-sm text-gray-500">
                Customer Name:{" "}
                {customerLoading
                  ? "Loading..."
                  : customer?.customer?.name ?? "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Walk-in Customer</p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-3">Payment Info</h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-medium">
                ৳ {sale.totalAmount ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Paid</span>
              <span className="text-green-600 font-medium">
                ৳ {sale.paidAmount ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Due</span>
              <span className="text-red-500 font-medium">
                ৳ {sale.dueAmount ?? 0}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg">Products</h2>
        </div>

        <SaleProductTable products={sale?.products ?? []} />
      </div>

      {/* SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">
          Sale Summary
        </h2>

        <div className="grid md:grid-cols-4 gap-4 text-sm">

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Total Sales</p>
            <p className="text-xl font-bold">
              ৳ {sale.totalAmount ?? 0}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Total Cost</p>
            <p className="text-xl font-bold">
              ৳ {sale.totalCost ?? 0}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-500">Total Profit</p>
            <p className="text-xl font-bold text-green-600">
              ৳ {sale.totalProfit ?? 0}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-gray-500">Discount</p>
            <p className="text-xl font-bold text-red-500">
              ৳ {sale.discount ?? 0}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SaleDetails;