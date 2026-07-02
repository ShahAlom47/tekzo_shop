"use client";

import { CustomTable } from "../CommonComponents/CustomTable";

interface MonthlySummary {
  month: number;
  monthName: string;

  totalSales: number;
  totalProfit: number;
  totalQuantity: number;

  expense: number;
  collection: number;
  stockBuy: number;

  due: number;
  actualProfit: number;
  remainingAmount: number;
  profitMargin: number;
}

interface Props {
  monthly: MonthlySummary[];
}

const SummaryTable = ({ monthly }: Props) => {
  const columns = [
    { header: "Month", accessor: "month" },
    { header: "Sales", accessor: "sales" },
    { header: "Profit", accessor: "profit" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Profit %", accessor: "profitMargin" },
    { header: "Expense", accessor: "expense" },
    { header: "Actual Profit", accessor: "actualProfit" },
    { header: "Collection", accessor: "collection" },
    { header: "Due", accessor: "due" },
    { header: "Purchase", accessor: "purchase" },
    { header: "Remaining", accessor: "remaining" },
  ];

  const data = monthly.map((item) => ({
    month: item.monthName,

    sales: `${item.totalSales.toLocaleString()} TK`,

    profit: `${item.totalProfit.toLocaleString()} TK`,

    quantity: item.totalQuantity.toLocaleString(),

    profitMargin: (
      <span className="font-medium text-green-600">
        {item.profitMargin}%
      </span>
    ),

    expense: `${item.expense.toLocaleString()} TK`,

    actualProfit: (
      <span
        className={
          item.actualProfit >= 0
            ? "text-green-600 font-medium"
            : "text-red-600 font-medium"
        }
      >
        {item.actualProfit.toLocaleString()} TK
      </span>
    ),

    collection: `${item.collection.toLocaleString()} TK`,

    due: (
      <span
        className={
          item.due > 0
            ? "text-red-500 font-medium"
            : "text-green-600"
        }
      >
        {item.due.toLocaleString()} TK
      </span>
    ),

    purchase: `${item.stockBuy.toLocaleString()} TK`,

    remaining: (
      <span
        className={
          item.remainingAmount >= 0
            ? "text-green-600 font-semibold"
            : "text-red-600 font-semibold"
        }
      >
        {item.remainingAmount.toLocaleString()} TK
      </span>
    ),
  }));

  return <CustomTable columns={columns} data={data} />;
};

export default SummaryTable;