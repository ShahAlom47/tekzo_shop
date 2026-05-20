"use client";
import Loading from "@/app/loading";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import SaleFilter from "@/Components/Sales/SaleFilter";
import SalesDataTable, { SaleWithPayment } from "@/Components/Sales/SalesDataTable";
import SaleSummary from "@/Components/Sales/SaleSummary";
import { SalesSummary } from "@/Interfaces/saleInterfaces";
import { getAllSales } from "@/lib/allApiRequest/salesRequest/salesRequest";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Sales = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatus("");
  };


  const { data, isLoading } = useQuery({
    queryKey: ["sales", page,search,startDate,endDate],
    queryFn: async () => {
      return await getAllSales({
        currentPage: page,
    limit,
    searchTrim: search,
    startDate,
    endDate,
    status
      });
    },
    placeholderData: (prev) => prev, // keep old data while fetching new
  });



  if (isLoading) return <Loading></Loading>;
  const totalPages = data?.totalPages || 0;
  const salesData = (data?.data as SaleWithPayment[]) || [];
  



  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Sales</h1>
      <SaleFilter
        search={search}
        setSearch={setSearch}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        status={status}
        setStatus={setStatus}
        clearFilters={clearFilters}
      />
      <SaleSummary summary={data?.summary as SalesSummary | undefined} />
      <SalesDataTable sales={salesData}></SalesDataTable>
      <DashPaginationButton
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Sales;
