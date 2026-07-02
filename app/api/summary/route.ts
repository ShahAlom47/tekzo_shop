import { NextResponse } from "next/server";
import {
  getExpensesCollection,
  getPaymentsCollection,
  getPurchaseCollection,
  getSalesCollection,
} from "@/lib/database/db_collections";

export async function GET(request: Request) {
  try {
    // =======================
    // Get Selected Year
    // =======================
    const { searchParams } = new URL(request.url);

    const currentYear = new Date().getFullYear();
    const year = Number(searchParams.get("year")) || currentYear;

const startDate = new Date(year, 0, 1).toISOString();
const endDate = new Date(year + 1, 0, 1).toISOString();

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
      saleCollection
        .find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .toArray(),

      purchaseCollection
        .find({
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .toArray(),

      expenseCollection
        .find({
          expenseDate: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .toArray(),

      paymentCollection
        .find({
          paymentDate: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .toArray(),
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const summary = monthNames.map((name, index) => ({
      month: index + 1,
      monthName: name,

      totalSales: 0,
      totalProfit: 0,
      totalQuantity: 0,

      expense: 0,
      collection: 0,
      stockBuy: 0,

      due: 0,
      actualProfit: 0,
      remainingAmount: 0,
      profitMargin: 0,
    }));

    // =======================
    // Sales
    // =======================
    for (const sale of sales) {
      const date = new Date(sale.createdAt);

      if (isNaN(date.getTime())) continue;

      const item = summary[date.getMonth()];

      item.totalSales += Number(sale.totalAmount || 0);
      item.totalProfit += Number(sale.totalProfit || 0);

      const quantity =
        sale.products?.reduce(
          (total: number, product: { quantity: number }) =>
            total + Number(product.quantity || 0),
          0
        ) || 0;

      item.totalQuantity += quantity;
    }

    // =======================
    // Expenses
    // =======================
    for (const expense of expenses) {
      const date = new Date(expense.expenseDate);

      if (isNaN(date.getTime())) continue;

      const item = summary[date.getMonth()];

      item.expense += Number(expense.amount || 0);
    }

    // =======================
    // Payments
    // =======================
    for (const payment of payments) {
      const date = new Date(payment.paymentDate);

      if (isNaN(date.getTime())) continue;

      const item = summary[date.getMonth()];

      item.collection += Number(payment.amount || 0);
    }

    // =======================
    // Purchases
    // =======================
    for (const purchase of purchases) {
      const date = new Date(purchase.date);

      if (isNaN(date.getTime())) continue;

      const item = summary[date.getMonth()];

      item.stockBuy += Number(purchase.grandTotal || 0);
    }

    // =======================
    // Monthly Calculations
    // =======================
    for (const item of summary) {
      item.actualProfit = item.totalProfit - item.expense;

      item.due = item.totalSales - item.collection;

      item.remainingAmount =
        item.collection - item.stockBuy - item.expense;

      item.profitMargin =
        item.totalSales > 0
          ? Number(((item.totalProfit / item.totalSales) * 100).toFixed(2))
          : 0;
    }

    // =======================
    // Overall Summary
    // =======================
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

    for (const item of summary) {
      overall.totalSales += item.totalSales;
      overall.totalProfit += item.totalProfit;
      overall.totalQuantity += item.totalQuantity;

      overall.expense += item.expense;
      overall.collection += item.collection;
      overall.stockBuy += item.stockBuy;
    }

    overall.actualProfit = overall.totalProfit - overall.expense;

    overall.due = overall.totalSales - overall.collection;

    overall.remainingAmount =
      overall.collection - overall.stockBuy - overall.expense;

    overall.profitMargin =
      overall.totalSales > 0
        ? Number(
            ((overall.totalProfit / overall.totalSales) * 100).toFixed(2)
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        year,
        monthly: summary,
        overall,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch summary data",
      },
      {
        status: 500,
      }
    );
  }
}