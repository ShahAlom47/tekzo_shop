
import { Purchase } from "@/Interfaces/purchaseInterface";
import { request } from "../apiRequests";

export const addPurchase = async (data: Purchase) => {
  return request("POST", "/purchase/add", {...data});
}
export const deletePurchase = async (id: string) => {
  return request("DELETE", `/purchase/delete/${id}`, undefined);
}
export const editPurchase = async (id: string, data: Partial<Purchase>) => {
  return request("PATCH", `/purchase/editPurchase/${id}`, {...data});
}


interface ParamsType {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  startDate?: string;
  endDate?: string;
}

export const getPurchases = async (params: ParamsType) => {
  const {
    currentPage,
    limit,
    searchTrim,
    startDate,
    endDate,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (startDate) queryParams.set("startDate", startDate);
  if (endDate) queryParams.set("endDate", endDate);

  const url = `/purchase/allPurchase?${queryParams.toString()}`;

  return request("GET", url, undefined, undefined, undefined);
};