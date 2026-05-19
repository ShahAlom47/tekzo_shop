import { OverviewFilter } from "@/Interfaces/overviewInterface";
import { request } from "../apiRequests";

// 🔹 Params type for Overview API
interface ParamsType {
  filter: OverviewFilter;
  searchTrim?: string;
  status?: string;
}


export const getOverview = async (params: ParamsType) => {
  const { filter, searchTrim, status } = params;


  const queryParams = new URLSearchParams();

  // 🔹 Always send type
  queryParams.set("type", filter.type);

  // 🔹 Only for custom month, calculate start/end date
  if (filter.type === "custom" && filter.month) {
    const [year, month] = filter.month.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    end.setHours(23, 59, 59, 999);


    queryParams.set("startDate", start.toISOString());
    queryParams.set("endDate", end.toISOString());
  }

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (status) queryParams.set("status", status);

  const url = `/overview?${queryParams.toString()}`;

  return request("GET", url);
};