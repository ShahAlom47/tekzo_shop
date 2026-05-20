import { ObjectId } from "mongodb";

export interface PurchaseMemo {
  shopName?: string;      // shop name (optional)
  memoNumber: string;     // memo no
  amount: number;         // ওই দোকানের total
}

export interface Purchase {
  _id?: string | ObjectId;

  date: string;

  memos: PurchaseMemo[];  // multiple shop memo

  productTotal: number;   // সব memo এর total

  transportCost?: number; // transport / extra cost

  otherCost?: number;     // extra expense (optional)

  grandTotal: number;     // final total (product + cost)

  note?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseSummaryType {
  totalProduct: number;
  totalTransport: number;
  totalOther: number;
  grandTotal: number;
}