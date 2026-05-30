import { ObjectId } from "mongodb";

export interface Return {
  _id?: ObjectId | string;

  saleNumber?: string; // কোন Sale থেকে Return এসেছে

  productId: string;
  productName: string;

  quantity: number;

  price: number;
  totalAmount: number;

  note?: string;


  createdAt: string; // ISO string
}