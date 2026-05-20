import { PaymentMethod } from "@/Interfaces/paymentInterface";


export interface Overview {
  overall: {
    totalPurchase: number;
    totalExpense: number;

    totalSales: number;
    totalPayment: number;

    totalCost: number;   // ✅ add
    totalDue: number;    // ✅ add
    netBalance: number;  // ✅ add

    profit: number;
  };

  filtered: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number;

    cost: number;   // ✅ add
    due: number;    // ✅ add

    profit: number;
  };

  counts: {
    totalPurchases: number;
    totalExpenses: number;
    totalSales: number;
    totalPayments: number;
  };

  today: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number;

    due: number; // ✅ add
  };

  thisWeek: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number;

    due: number; // ✅ add
  };

  thisMonth: {
    purchase: number;
    expense: number;
    sales: number;
    payment: number;

    due: number; // ✅ add
  };

  stock: {
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalStockValue: number;
  };

  insights?: {
    topSellingProduct?: string;
    topExpenseCategory?: string;
    topPaymentMethod?: PaymentMethod;
  };
}
export type OverviewFilter =
  | { type: "today" }
  | { type: "custom"; month: string }; // month in "YYYY-MM" format