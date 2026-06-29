// interfaces/summaryInterface.ts

export type SummaryFilterType =
  | "today"
  | "custom"
  | "month"
  | "year";

export interface SummaryFilter {
  type: SummaryFilterType;

  // ISO String
  startDate?: string;
  endDate?: string;
}

export interface SummaryRow {
  // Date Information
  period: string;          // 29-Jun-2026 / Jan-2026 / 2026
  startDate: string;       // ISO String
  endDate: string;         // ISO String

  // Sales
  totalSales: number;
  totalProfit: number;
  totalQuantity: number;
  profitMargin: number;

  // Expense
  expense: number;
  actualProfit: number;

  // Payment
  collection: number;
  due: number;

  // Purchase
  stockBuy: number;

  // Balance
  remainingAmount: number;
}

export interface SummaryResponse {
  success: boolean;
  data: SummaryRow[];
}


// Helper  Interfaces 

export interface SalesSummary {
  totalSales: number;
  totalProfit: number;
  totalQuantity: number;
}



export interface PaymentSummary {
  totalCollection: number;
}
export interface PurchaseSummary {
  totalPurchase: number;
}