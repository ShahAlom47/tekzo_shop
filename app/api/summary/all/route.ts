import { NextResponse } from "next/server";
import {
  getExpensesCollection,
  getPaymentsCollection,
  getPurchaseCollection,
  getSalesCollection,
} from "@/lib/database/db_collections";

export async function GET() {
  try {
    const [
      saleCollection,
      purchaseCollection,
      expenseCollection,
      paymentCollection,
    ] = await Promise.all([
      getSalesCollection(),
      getPurchaseCollection(),
      getExpensesCollection(),
      getPaymentsCollection(),
    ]);

    const [sales, purchases, expenses, payments] = await Promise.all([
      saleCollection.find().toArray(),
      purchaseCollection.find().toArray(),
      expenseCollection.find().toArray(),
      paymentCollection.find().toArray(),
    ]);

    const overall = {
      totalSales: 0,
      totalProfit: 0,
      totalQuantity: 0,

      expense: 0,
      collection: 0,
      stockBuy: 0,

      actualProfit: 0,
      due: 0,
      remainingAmount: 0,
      profitMargin: 0,
    };

    // =======================
    // Sales
    // =======================
    for (const sale of sales) {
      overall.totalSales += Number(sale.totalAmount || 0);
      overall.totalProfit += Number(sale.totalProfit || 0);

      const quantity =
        sale.products?.reduce(
          (total: number, product: { quantity: number }) =>
            total + Number(product.quantity || 0),
          0
        ) || 0;

      overall.totalQuantity += quantity;
    }

    // =======================
    // Expenses
    // =======================
    for (const expense of expenses) {
      overall.expense += Number(expense.amount || 0);
    }

    // =======================
    // Payments
    // =======================
    for (const payment of payments) {
      overall.collection += Number(payment.amount || 0);
    }

    // =======================
    // Purchases
    // =======================
    for (const purchase of purchases) {
      overall.stockBuy += Number(purchase.grandTotal || 0);
    }

    // =======================
    // Final Calculation
    // =======================
    overall.actualProfit =
      overall.totalProfit - overall.expense;

    overall.due =
      overall.totalSales - overall.collection;

    overall.remainingAmount =
      overall.collection -
      overall.stockBuy -
      overall.expense;

    overall.profitMargin =
      overall.totalSales > 0
        ? Number(
            ((overall.totalProfit / overall.totalSales) * 100).toFixed(2)
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        overall,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch all-time summary",
      },
      {
        status: 500,
      }
    );
  }
}