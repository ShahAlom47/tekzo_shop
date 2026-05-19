
import { Category, GetAllCategoryParams } from "@/Interfaces/categoryInterfaces";
import { request } from "../apiRequests";
import { ObjectId } from "mongodb";



export const addCategory = async (data:Category) => {
  return request("POST", "/categories/add", { ...data }, );
}

export const getAllCategories = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
  const url = `/categories/getAllCategory?currentPage=${currentPage}&pageSize=${limit}` +
              (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

  return request("GET", url);
};

export const getSingleCategory = async (id:string|ObjectId,)=>{
  return request("GET",`/category/getSingleCategory/${id}`)
}

export const updateCategory = async (id:string|ObjectId,data:Category)=>{
  return request("PATCH",`/categories/update/${id}`,{...data})
}

export const deleteCategory= async (id: string|ObjectId ) => {
  return request("DELETE", `/categories/deleteCategory/${id}`);
}
