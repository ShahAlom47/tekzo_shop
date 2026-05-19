import { FundRecord } from "@/Interfaces/fundRecordInterface";
import { request } from "../apiRequests";
import { Category } from "@/Interfaces/categoryInterfaces";
import { ObjectId } from "bson";

interface GetAllCategoryParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
}

export const addFundRecord = async (data:FundRecord) => {
  return request("POST", "/fund/add", { ...data }, );
}

export const getAllFundRecords = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
  const url = `/fund/getAllFundRecords?currentPage=${currentPage}&pageSize=${limit}` +
              (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

  return request("GET", url);
};



export const updateFundRecord = async (id:string|ObjectId,data:FundRecord)=>{
  return request("PATCH",`/fund/update/${id}`,{...data})
}

export const deleteFundRecord= async (id: string|ObjectId ) => {
  return request("DELETE", `/fund/delete/${id}`);
}
