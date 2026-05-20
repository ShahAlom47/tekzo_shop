import { ObjectId } from "mongodb";

export type ID = ObjectId | string;

export type PaymentMethod = "CASH" | "BKASH" | "BANK" | "CARD";

export type PaymentType = "SALE_PAYMENT" | "DUE_PAYMENT";

export interface Payment {
  _id?: ID;

  // Reference
  customerId: ID;
  saleId?: ID;

  // Payment info
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
  paymentDate: string;
  note?: string;
  transactionId?: string;

  // Metadata
  createdBy?: ID;
  createdAt: string;
  updatedAt?: string;
}

export interface AddPaymentFormType {
  customerId: string;
  amount: number;
  method: "CASH" | "BKASH" | "BANK" | "CARD";
  note?: string;
  transactionId: string;
  paymentDate: string;
}
