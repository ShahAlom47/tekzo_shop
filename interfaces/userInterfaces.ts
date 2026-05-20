import { ObjectId } from "mongodb";

export type UserRole = "admin" |"staff";

 export interface User {
  _id?: string| ObjectId;                // uuid
  fullName: string;
  phone: string;
  passwordHash: string;

  role: UserRole;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}