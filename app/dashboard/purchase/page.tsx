"use client";

import Loading from "@/app/loading";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import { getPurchases } from "@/lib/allApiRequest/purchaseRequest/purchaseRequest";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { Purchase, PurchaseSummaryType } from "@/Interfaces/purchaseInterface";
import PurchaseDataTable from "@/Components/Purchase/PurchaseDataTable";
import PurchaseFilter from "@/Components/Purchase/PurchaseFilter";
import PurchaseSummary from "@/Components/Purchase/PurchaseSummary";

const PurchasePage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    search: "",
    month: "",
  });

const getMonthRange = (month: string) => {
  if (!month) return { startDate: "", endDate: "" };

  const start = new Date(month + "-01T00:00:00.000Z");
  const end = new Date(start);

  // next month
  end.setMonth(end.getMonth() + 1);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

  const { startDate, endDate } = getMonthRange(filters.month);

  const { data, isLoading } = useQuery({
    queryKey: ["purchases", page, filters.search, filters.month],
    queryFn: async () => {
      const res = await getPurchases({
        currentPage: page,
        limit,
        searchTrim: filters.search,
        startDate,
        endDate,
      });
      return res;
    },
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Loading />;

  const totalPages = data?.totalPages || 0;
  const purchaseData = (data?.data as Purchase[]) || [];
const summary = data?.summary as PurchaseSummaryType || {
  totalProduct: 0,
  totalTransport: 0,
  totalOther: 0,
  grandTotal: 0,
};


  return (
    <div className="p-6 space-y-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Purchase History</h2>
        <Link
          href="/dashboard/purchase/add"
          className="bg-blue-600 text-white px-4 py-2  rounded-lg"
        >
          + Add Purchase
        </Link>
      </div>

      {/* Filters */}
      <PurchaseFilter onChange={setFilters} />
      <PurchaseSummary summary={summary} />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <PurchaseDataTable purchases={purchaseData} />

        <DashPaginationButton
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default PurchasePage;