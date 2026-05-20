import { ObjectId } from "mongodb";

export type ID = ObjectId | string;

export type PaymentMethod = "CASH" | "BKASH" | "BANK" | "CARD";

export type PaymentType = "SALE_PAYMENT" | "DUE_PAYMENT";

export interface SaleProduct {
  productId: ID;
  productName?: string;

  quantity: number;

  sellingPrice: number;
  costPrice: number;

  totalPrice: number;
  totalCost: number;
  profit: number;
}

export interface Sale {
  _id?: ID;

  customerId?: ID; // optional (walk-in customer)

  products: SaleProduct[];

  discount?: number;

  totalAmount: number;
  totalCost: number;
  totalProfit: number;

  saleNumber?: string;

  createdBy?: ID;
  createdAt: string;
}

export interface AddSaleRequest {
  sale: {
    customerId?: ID;
    products: SaleProduct[];

    discount?: number;
    saleNumber?: string;

    totalAmount: number;
    totalCost: number;
    totalProfit: number;
  };

  payment?: {
    amount: number;
    method: PaymentMethod;
    note?: string;
  };
}

export interface AddPaymentRequest {
  customerId: ID;

  amount: number;
  method: PaymentMethod;

  note?: string;
}
export type PaymentFormData = {
  amount: string; // input থেকে string আসে
  method: PaymentMethod;
  transactionId?: string ;
  paymentDate?: string;
  note?: string;
};

export interface CustomerSummary {
  customerId: ID;

  totalSales: number;
  totalPaid: number;
  dueAmount: number;
}



export interface CustomerSaleHistory{
   saleNumber: number,
        createdAt: string,
        totalAmount: number,
        paidAmount: number,
        dueAmount: number,


}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  totalProfit: number;
}