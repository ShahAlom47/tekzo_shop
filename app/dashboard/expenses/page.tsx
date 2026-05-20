"use client";

import CustomModal from "@/Components/CommonComponents/CustomModal";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import AddExpenseForm from "@/Components/Expenses/AddExpenses";
import ExpenseFilter from "@/Components/Expenses/ExpenseFilter";
import ExpensesTable from "@/Components/Expenses/ExpensesTable";
import { Expense } from "@/Interfaces/expensesInterface";
import { getExpenses } from "@/lib/allApiRequest/expensesRequest/expensesRequest";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
interface ExpensesResponse {
  success: boolean;
  message: string;
  data: {
    expenses: Expense[];
    totalAmount: number;
  };
  totalPages: number;
  totalCount: number;
}

const Expenses = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ExpensesResponse>({
    queryKey: ["expenses", page, filters], // 🔥 IMPORTANT
    queryFn: async () => {
      const res = await getExpenses({
        currentPage: page,
        limit: limit,
        sort: "newest",
        ...filters,
      });
      return res as ExpensesResponse;
    },
  });

  const expenses = (data?.data?.expenses as Expense[]) || [];
  const totalPages = data?.totalPages || 1;
  const totalExpenses=data?.data?.totalAmount



  return (
    <div className="p-5">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Expenses</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>

      <div className="bg-white shadow rounded p-3">

        {/* 🔥 Filter always visible */}
        <ExpenseFilter
        totalAmount={totalExpenses}
          onFilterChange={(newFilters) => {
            setPage(1);
            setFilters(newFilters);
          }}
        />

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Something went wrong!</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-5">
            No expenses found 😐
          </p>
        ) : (
          <>
            <ExpensesTable expenses={expenses}  />

            <DashPaginationButton
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              className="mt-4"
            />
          </>
        )}
      </div>

      {/* 🔹 Modal */}
      <CustomModal
        title="Add Expense"
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <AddExpenseForm
          onSuccess={() => {
            setOpenModal(false);

            // 🔥 refetch after add
            queryClient.invalidateQueries({
              queryKey: ["expenses"],
            });
          }}
        />
      </CustomModal>
    </div>
  );
};

export default Expenses;