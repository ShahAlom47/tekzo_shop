import { AddSaleRequest, Sale } from "@/interfaces/saleInterfaces";
import { request } from "../apiRequests";

interface ParamsType {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const addSale = async (data: AddSaleRequest) => {
  return request("POST", "/sales/add", {...data});
}
export const getAllSales = async (params: ParamsType) => {
  const {
    currentPage,
    limit,
    searchTrim,
    startDate,
    endDate,
    status,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (startDate) queryParams.set("startDate", startDate);
  if (endDate) queryParams.set("endDate", endDate);
  if (status) queryParams.set("status", status);

  const url = `/sales/allSales?${queryParams.toString()}`;

  return request("GET", url, undefined, undefined, undefined);
};


export  const getSaleById = async (id:string) => {
  return request("GET", `/sales/${id}`);
} 


export  const saleDelete = async (id:string) => {
  return request("DELETE", `/sales/delete/${id}`);
} 