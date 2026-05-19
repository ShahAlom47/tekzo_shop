
import {  ExpenseFormType, GetExpensesParams } from "@/Interfaces/expensesInterface";
import { request } from "../apiRequests";


export const addExpenses = async (data:ExpenseFormType) => {
  return request("POST", `/expenses/add`,{...data});
}

export const getExpenses = async (params: GetExpensesParams) => {
  const {
    currentPage,
    limit,
    searchTrim,
    category,
    month,
    sort,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (category) queryParams.set("category", category);
  if (month) queryParams.set("month", month); // 🔥 important
  if (sort) queryParams.set("sort", sort);

  const url = `/expenses?${queryParams.toString()}`;

  return request("GET", url);
};

export const editExpenses = async ( id:string,data:ExpenseFormType) => {
  return request("PATCH", `/expenses/edit/${id}`,{...data});
}
export const deleteExpenses = async ( id:string) => {
  return request("DELETE", `/expenses/delete/${id}`);
}



