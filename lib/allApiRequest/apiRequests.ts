import axios from "axios";
import type { AxiosError } from "axios";

// ✅ দুইটা generic: T = data, S = summary
export interface IApiResponse<T = unknown, S = unknown> {
  success: boolean;
  message: string;
  insId?: string;
  unreadCount?: number;
  data?: T;
  summary?: S;
  totalData?: number;
  currentPage?: number;
  totalPages?: number;
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API_BASE_URL = 'http://localhost:3000'
const API_BASE_URL = 'https://tekzo-shop.vercel.app'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export const request = async <T = unknown, S = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: Record<string, unknown> | FormData,
  isForm?: "formData",
  customHeaders?: Record<string, string>
): Promise<IApiResponse<T, S>> => {
  try {
    const headers = {
      "Content-Type":
        isForm === "formData" ? "multipart/form-data" : "application/json",
      ...customHeaders,
    };

    // ✅ Auto timestamps
    if (data && !(data instanceof FormData)) {
      const now = new Date().toISOString();
      if (method === "POST") {
        data = { ...data, createdAt: now, updatedAt: now };
      } else if (method === "PUT" || method === "PATCH") {
        data = { ...data, updatedAt: now };
      }
    }

    const response = await api({
      method,
      url,
      data,
      headers,
    });

    return response.data as IApiResponse<T, S>;
  } catch (error: unknown) {
    let message = "Unknown error occurred";

    if (axios.isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as AxiosError<any>;

      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
    };
  }
};