
import { GetAllProductParams, ProductFormData } from "@/Interfaces/productInterface";
import { request } from "../apiRequests";

export const getAllProduct = async (params: GetAllProductParams) => {
  const {
    currentPage,
    limit,
    searchTrim,
    sort,
    minPrice,
    maxPrice,
    category,
    brand,
    stock,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (sort) queryParams.set("sort", sort);
  if (minPrice) queryParams.set("minPrice", String(minPrice));
  if (maxPrice) queryParams.set("maxPrice", String(maxPrice));
  if (category) queryParams.set("category", category);
  if (brand) queryParams.set("brand", brand);
  if (stock) queryParams.set("stock", stock);

  const url = `/products/allProducts?${queryParams.toString()}`;

  
  return request("GET", url, undefined, undefined, undefined);
};


export const addProduct = async (data: ProductFormData) => {
  return request("POST", "/products/add", {...data});
}
export const getSingleProduct = async (id: string) => {
  return request("GET", `/products/${id}`);
}
export const updateProduct = async (id: string,data:ProductFormData) => {
  return request("PATCH", `/products/edit/${id}`,{...data});
}
export const deleteProduct = async (id: string) => {
  return request("DELETE", `/products/delete/${id}`);
}





