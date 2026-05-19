import { AddPaymentFormType, Payment } from "@/Interfaces/paymentInterface";
import { request } from "../apiRequests";

interface ParamsType {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  month?: string; // 🔥 important
}

export const getPayments = async (params: ParamsType) => {
  const {
    currentPage,
    limit,
    status,
    month,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));
  if (status) queryParams.set("status", status);
  if (month) queryParams.set("month", month);

  const url = `/payment/allPayment?${queryParams.toString()}`;

  return request("GET", url, undefined, undefined, undefined);
};

export const addPayment = async (data: AddPaymentFormType) => {
  return request("POST",  `/payment/addPayment`, { ...data },);
};