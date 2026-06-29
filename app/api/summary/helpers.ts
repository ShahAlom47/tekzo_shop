/* eslint-disable @typescript-eslint/no-explicit-any */

import { Expense } from "@/interfaces/expensesInterface";
import { Payment,  } from "@/interfaces/paymentInterface";
import { Purchase } from "@/interfaces/purchaseInterface";
import { Sale } from "@/interfaces/saleInterfaces";
import { PaymentSummary, PurchaseSummary, SalesSummary } from "@/interfaces/summaryInterfaces";
import { Collection } from "mongodb";

export interface DateRange {
  startDate?: string;
  endDate?: string;
}





/**
 * Build MongoDB Date Filter
 */
export const buildDateFilter = (
  field: string,
  range: DateRange,
) => {
  if (!range.startDate && !range.endDate) return {};

  const filter: any = {};

  if (range.startDate) {
    const start = new Date(range.startDate);
    start.setUTCHours(0, 0, 0, 0);
    filter.$gte = start;
  }

  if (range.endDate) {
    const end = new Date(range.endDate);
    end.setUTCHours(23, 59, 59, 999);
    filter.$lte = end;
  }

  return {
    [field]: filter,
  };
};


export const getDateRange = (
  type: "today" | "custom" | "month" | "year",
  startDate?: string,
  endDate?: string,
): DateRange => {
  switch (type) {
    case "today": {
      const today = new Date();

      return {
        startDate: new Date(
          today.setHours(0, 0, 0, 0),
        ).toISOString(),

        endDate: new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString(),
      };
    }

    case "custom":
      return {
        startDate,
        endDate,
      };

    default:
      return {};
  }
};



 export const getSalesSummary = async (
  saleCollection: Collection<Sale>,
  saleFilter: object,
): Promise<SalesSummary> => {
  const sales = await saleCollection.find(saleFilter).toArray();

  const summary = sales.reduce<SalesSummary>(
    (acc, sale) => {
      acc.totalSales += sale.totalAmount;
      acc.totalProfit += sale.totalProfit;

      acc.totalQuantity += sale.products.reduce(
        (qty, product) => qty + product.quantity,
        0,
      );

      return acc;
    },
    {
      totalSales: 0,
      totalProfit: 0,
      totalQuantity: 0,
    },
  );

  return summary;
};

export interface ExpenseSummary {
  totalExpense: number;
}

export const getExpenseSummary = async (
  expenseCollection: Collection<Expense>,
  expenseFilter: object,
): Promise<ExpenseSummary> => {
  const result = await expenseCollection
    .aggregate([
      {
        $match: expenseFilter,
      },
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$amount",
          },
        },
      },
    ])
    .toArray();

  return {
    totalExpense: result[0]?.totalExpense || 0,
  };
};

export const getPaymentSummary = async (
  paymentCollection: Collection<Payment>,
  paymentFilter: object,
): Promise<PaymentSummary> => {
  const result = await paymentCollection
    .aggregate([
      {
        $match: paymentFilter,
      },
      {
        $group: {
          _id: null,
          totalCollection: {
            $sum: "$amount",
          },
        },
      },
    ])
    .toArray();

  return {
    totalCollection: result[0]?.totalCollection || 0,
  };
};

export const getPurchaseSummary = async (
  purchaseCollection: Collection<Purchase>,
  purchaseFilter: object,
): Promise<PurchaseSummary> => {
  const result = await purchaseCollection
    .aggregate([
      {
        $match: purchaseFilter,
      },
      {
        $group: {
          _id: null,
          totalPurchase: {
            $sum: "$grandTotal",
          },
        },
      },
    ])
    .toArray();

  return {
    totalPurchase: result[0]?.totalPurchase || 0,
  };
};