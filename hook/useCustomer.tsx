import { useQuery } from "@tanstack/react-query";
import { getSingleCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";
import { CustomerDetailsData } from "@/Interfaces/customerInterface";

const fetchCustomer = async (id: string): Promise<CustomerDetailsData> => {
  const res = await getSingleCustomer(id);

  if (!res.success) {
    throw new Error("Failed to fetch customer");
  }

  return res.data as CustomerDetailsData;
};

export const useCustomer = (id: string) => {
  return useQuery<CustomerDetailsData, Error>({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};