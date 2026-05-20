import { ObjectId } from "mongodb";

export default interface Category {
  _id?: ObjectId | string;

  name: string;
  slug: string;
  icon?: string;

  parentCategoryId?: ObjectId | null;

  status: "active" | "inactive";

  createdAt: string;
  updatedAt: string;
}

export type GetAllCategoryParams = {
  currentPage?: number;  
  limit?: number;
  searchTrim?: string;
};