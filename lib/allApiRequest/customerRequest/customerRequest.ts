import { AddCustomerFormInputs } from "@/Interfaces/customerInterface";
import { request } from "../apiRequests";
import { GetAllCategoryParams } from "@/Interfaces/categoryInterfaces";

export const addCustomer = async (data:AddCustomerFormInputs) => {
  return request("POST", "/customers/add", { ...data }, );
}

export const getCustomer = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
  const url = `/customers/getCustomers?currentPage=${currentPage}&pageSize=${limit}` +
              (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

  return request("GET", url);
};
export const deleteCustomer = async (id:string) => {
  const url = `/customers/delete/${id}`;
  return request("DELETE", url);
};
export const updateCustomer = async (id:string,data:AddCustomerFormInputs) => {

  return request("PATCH", `/customers/edit/${id}`,{...data});
};
export const getSingleCustomer = async (id:string) => {

  return request("GET", `/customers/${id}`);
};