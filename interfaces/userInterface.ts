import { ObjectId } from "mongodb";

export interface User {
  id?: string | ObjectId;
  name: string;
  phone: string;
  password:string;

  role: "admin" | "staff";

  isActive: boolean;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}