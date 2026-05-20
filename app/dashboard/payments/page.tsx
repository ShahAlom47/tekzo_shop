"use client";

import Loading from "@/app/loading";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import PaymentDataTable from "@/Components/PaymentComponent/PaymentDataTable";
import PaymentHeader from "@/Components/PaymentComponent/PaymentHeader";
import { Payment } from "@/Interfaces/paymentInterface";
import { getPayments } from "@/lib/allApiRequest/paymentRequest/paymentRequest";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Payments = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");

  const clearFilters = () => {
    setMonth("");
    setStatus("");
    setPage(1);
  };


  const { data, isLoading } = useQuery({
    queryKey: ["payments", page,  month, status],
    queryFn: async () => {
      const res = await getPayments({
        currentPage: page,
        limit,
        status,
        month,
      });
      return res;
    },
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <Loading />;

  const totalPages = data?.totalPages || 0;
  const paymentData = (data?.data as Payment[]) || [];
  const totalPaymentAmount = (data?.summary as { totalAmount?: number }) || {};

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h1 className="text-lg font-bold">Payments</h1>
        
        <PaymentHeader
          month={month}
          setMonth={setMonth}
          totalAmount={totalPaymentAmount?.totalAmount || 0}
          clearFilters={clearFilters}
        />

        <PaymentDataTable payments={paymentData} />

        <DashPaginationButton
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Payments;