import { ObjectId } from "mongodb";

export interface ReturnProduct {
  productId: string;
  productName?: string;

  quantity: number;

  sellingPrice: number;
  costPrice: number;

  totalPrice: number;
  totalCost: number;
  profit: number;
}

export interface Return {
  _id?: ObjectId | string;

  saleNumber?: string; // which sale this return belongs to

  products: ReturnProduct[];

  totalQuantity: number;
  totalAmount: number;
  totalCost: number;
  totalProfit: number;

  note?: string;

  createdAt?: string; // ISO string
}