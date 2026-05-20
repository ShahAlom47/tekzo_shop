"use client";

import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/Interfaces/customerInterface";
import { getCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";



const fetchCustomers = async (): Promise<Customer[]> => {
  const res = await getCustomer({
    currentPage: 1,
    limit: 1000, // Assuming you want to fetch the first 100 customers
  });

  if (!res.success) {
    throw new Error("Failed to fetch customers");
  }

 

  return res.data as Customer[] || [];
};

export const useCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 30, // 30 min cache
    refetchOnWindowFocus: false, // optional, avoid refetch on focus
  });
};