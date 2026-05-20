import { ObjectId } from "mongodb";
// ProductUnit.ts
export type ProductUnit = "PCS" | "KG" | "LITER" | "BOX" | "Feet";
export interface Product {
  _id: ObjectId;

  name: string;
  slug: string;
  productCode?: string;
  brand?: string;
  categoryId: string;

  costPrice: number;
  sellingPrice: number;

  unit: ProductUnit;

  currentStock: number;
  totalSold: number;

  stockValue?: number;

  supplierId?: string;

  status: "ACTIVE" | "INACTIVE";

  isDeleted?: boolean;

  createdAt: string;
  updatedAt: string;
}


export interface ProductFormData {
  // Basic Info
  name: string;
  slug: string;
  productCode?: string;
  brand?: string;
  categoryId: string;

  // Pricing
  costPrice: number;            // Buying price
  sellingPrice: number;   

  // Inventory
  openingStock: number;         // Initial stock
  currentStock: number;          
  unit: "PCS" | "KG" | "LITER" | "BOX" | "Feet";

  // Supplier
  supplierId?: string;

  // Status
  status: "ACTIVE" | "INACTIVE";
}

export type SortOptions = "asc" | "desc" | "newest" | "popular";

export interface GetAllProductParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  sort?: SortOptions;
  minPrice?: string | number;
  maxPrice?: string | number;
  category?: string;
  brand?: string;
  rating?: string;
   offerOnly?: boolean;         // ✅ new: only active offer products
  isDashboardRequest?: boolean;
  stock?:"in-stock"| "out-of-stock";
  // any more you want
}
