import { ObjectId } from "mongodb";

// 🔹 Category constant (Single source of truth)
export const EXPENSE_CATEGORY = {
  DAILY_POCKET_MONEY: "daily_pocket_money",
  RENT: "rent",
  WIFI_BILL: "wifi_bill",
  ELECTRIC_BILL: "electric_bill",
  BILL: "bill",
  SALARY: "salary",
  TRANSPORT: "transport",
  OTHERS: "others",
} as const;

// 🔥 Type derive from constant (No duplicate / no typo)
export type ExpenseCategory =
  (typeof EXPENSE_CATEGORY)[keyof typeof EXPENSE_CATEGORY];

// 🔹 Main Expense Model
export interface Expense {
  _id?: ObjectId; // MongoDB ID
  title: string; // Example: "Nasta", "Electricity"
  expenseDate: string; // ISO string (when expense happened)
  amount: number; // টাকা
  category: ExpenseCategory; // category
  note?: string; // optional
  createdAt: string; // record created time
}

// 🔹 Form Type (Frontend use)
export interface ExpenseFormType {
  title: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
}

// 🔹 Dropdown Options
export const expenseCategoryOptions = [
  { label: "Daily Pocket Money", value: EXPENSE_CATEGORY.DAILY_POCKET_MONEY },
  { label: "Rent", value: EXPENSE_CATEGORY.RENT },
  { label: "WiFi Bill", value: EXPENSE_CATEGORY.WIFI_BILL },
  { label: "Electric Bill", value: EXPENSE_CATEGORY.ELECTRIC_BILL },
  { label: "Bill", value: EXPENSE_CATEGORY.BILL },
  { label: "Salary", value: EXPENSE_CATEGORY.SALARY },
  { label: "Transport", value: EXPENSE_CATEGORY.TRANSPORT },
  { label: "Others", value: EXPENSE_CATEGORY.OTHERS },
];

type SortOption = "newest" | "oldest" | "high" | "low";

export interface GetExpensesParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  category?: string;
  month?: string; // 🔥 YYYY-MM
  sort: SortOption;
}
