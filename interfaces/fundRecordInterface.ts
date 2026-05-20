import { ObjectId } from "mongodb";

// ✅ FundRecord Interface
export interface FundRecord {
  _id?: string|ObjectId; // Unique ID
  source: string; // “Personal”, “Loan from Bank”, “Investor A”, “Shop Revenue”, ইত্যাদি
  type: "IN" | "OUT"; // টাকা এসেছে কিনা বা গেছে
  amount: number; // Amount in ৳
  date: string; // ISO format
  category: "Investment" | "Loan" | "Expense" | "Profit" | "Others";
  note?: string; // Optional description
  paymentMethod?: "Cash" | "Bank Transfer" | "Mobile Payment" | "Other"; // Optional
  relatedParty?: string; // Optional, Investor name, Supplier, Customer etc.
  tags?: string[]; // Optional, for filtering or grouping
  createAt?: string; // ISO date string
  updateAt?: string; // ISO date string
}