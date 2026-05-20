"use client";

import Loading from "@/app/loading";
import AddCustomer from "@/Components/CommonComponents/AddCustomer";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import SearchBox from "@/Components/CommonComponents/SearchBox";
import CustomerTable from "@/Components/CustomerComponet/CustomarTable";
import { Customer } from "@/Interfaces/customerInterface";
import { getCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Customers = () => {
  const [search, setSearch] = useState("");

  const [isOpen, setOpen] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const limit = 10;


  const { data, isLoading,  refetch } = useQuery({
    queryKey: ["getCustomers", page,search],
    queryFn: async () => {
      const response = await getCustomer({
        currentPage: page,
        limit,
        searchTrim: search.trim(),
      });
      // if (!response || !response.success) {
      //   throw new Error(response.message || "Failed to fetch category data");
      // }
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const customer = (data?.data as Customer[]) || [];


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">All Customer</h1>

      <div className="flex gap-2 justify-between  items-center  border-b-2 border-gray-900  p-2">
        <SearchBox
          placeholder="Search customer..."
          value={search}
          setValue={setSearch}
        />

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg  "
        >
          + Add
        </button>
      </div>
      {!isLoading ? (
        <CustomerTable customer={customer} refetch={refetch}></CustomerTable>
      ) : (
        <Loading></Loading>
      )}
      <DashPaginationButton
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      ></DashPaginationButton>

      <CustomModal
        open={isOpen}
        onOpenChange={setOpen}
        title="Add New Customer"
      >
        <AddCustomer></AddCustomer>
      </CustomModal>
    </div>
  );
};

export default Customers;
