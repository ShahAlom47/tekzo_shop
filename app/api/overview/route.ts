/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Overview } from "@/Interfaces/overviewInterface";
import {
  getPurchaseCollection,
  getSalesCollection,
  getExpensesCollection,
  getProductCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { PaymentMethod } from "@/Interfaces/paymentInterface";

type DateRange = { startDate?: string; endDate?: string };

// 🔥 Build MongoDB date filter
const buildDateFilter = (field: string, range: DateRange) => {
  if (!range.startDate && !range.endDate) return {};

  const filter: any = {};

  if (range.startDate) {
    const start = new Date(range.startDate);
    // set UTC 00:00:00
    start.setUTCHours(0, 0, 0, 0);
    filter.$gte = start;
  }

  if (range.endDate) {
    const end = new Date(range.endDate);
    // set UTC 23:59:59
    end.setUTCHours(23, 59, 59, 999);
    filter.$lte = end;
  }

  return { [field]: filter };
};

// 🔹 Convert filter type to start/end date
const getDateRangeFromQuery = (
  type: string,
  startDate?: string,
  endDate?: string,
) => {
  if (type === "custom" && startDate && endDate) return { startDate, endDate };
  if (type === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }
  // all types (week/month) handled by frontend if needed
  return {};
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "today";
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;

    const dateRange = getDateRangeFromQuery(type, startDate, endDate);

    // ------------------------
    // Collections
    // ------------------------
    const [
      purchaseCollection,
      saleCollection,
      expenseCollection,
      productCollection,
      paymentCollection,
    ] = await Promise.all([
      getPurchaseCollection(),
      getSalesCollection(),
      getExpensesCollection(),
      getProductCollection(),
      getPaymentsCollection(),
    ]);

    // ------------------------
    // Filters
    // ------------------------
    const purchaseFilter = buildDateFilter("date", dateRange);
    const expenseFilter = buildDateFilter("expenseDate", dateRange);
    const saleFilter = buildDateFilter("createdAt", dateRange);
    const paymentFilter = buildDateFilter("paymentDate", dateRange);

    // ------------------------
    // Purchases
    // ------------------------
    const totalPurchaseResult = await purchaseCollection
      .aggregate([
        { $match: purchaseFilter },
        { $group: { _id: null, totalAmount: { $sum: "$grandTotal" } } },
      ])
      .toArray();

    const totalPurchase = totalPurchaseResult[0]?.totalAmount || 0;
    const totalPurchasesCount =
      await purchaseCollection.countDocuments(purchaseFilter);

    // ------------------------
    // Expenses
    // ------------------------
    const totalExpenseResult = await expenseCollection
      .aggregate([
        { $match: expenseFilter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ])
      .toArray();

    const totalExpense = totalExpenseResult[0]?.totalAmount || 0;
    const totalExpensesCount =
      await expenseCollection.countDocuments(expenseFilter);

    // ------------------------
    // Sales
    // ------------------------
    const totalSalesResult = await saleCollection
      .aggregate([
        { $match: saleFilter },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ])
      .toArray();

    const totalSales = totalSalesResult[0]?.totalAmount || 0;
    const totalSalesCount = await saleCollection.countDocuments(saleFilter);

    // ------------------------
    // Payments
    // ------------------------
    const totalPaymentResult = await paymentCollection
      .aggregate([
        { $match: paymentFilter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ])
      .toArray();

    const totalPayment = totalPaymentResult[0]?.totalAmount || 0;
    const totalPaymentsCount =
      await paymentCollection.countDocuments(paymentFilter);

    // ------------------------
    // Calculations
    // ------------------------
    const totalCost = totalPurchase + totalExpense;
    const profit = totalSales - totalCost;
    const totalDue = totalSales - totalPayment;
    const netBalance = totalPayment - totalCost;

    // ------------------------
    // Stock
    // ------------------------
    const products = await productCollection.find().toArray();
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.currentStock > 0).length;
    const outOfStock = products.filter((p) => p.currentStock === 0).length;
    const lowStock = products.filter(
      (p) => p.currentStock > 0 && p.currentStock < 5,
    ).length;
    const totalStockValue = products.reduce(
      (acc, p) => acc + p.currentStock * p.costPrice,
      0,
    );

    // ------------------------
    // Insights
    // ------------------------
    const topProductResult = await saleCollection
      .aggregate([
        { $match: saleFilter },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalQty: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topSellingProduct = topProductResult[0]?._id || null;

    const topExpenseCategoryResult = await expenseCollection
      .aggregate([
        { $match: expenseFilter },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topExpenseCategory = topExpenseCategoryResult[0]?._id || null;

    const topPaymentMethodResult = await paymentCollection
      .aggregate([
        { $match: paymentFilter },
        {
          $group: {
            _id: "$method",
            totalAmount: { $sum: "$amount" },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const topPaymentMethod: PaymentMethod | undefined =
      topPaymentMethodResult[0]?._id || undefined;

    // ------------------------
    // Final Response
    // ------------------------
    const overview: Overview = {
      overall: {
        totalPurchase,
        totalExpense,
        totalSales,
        totalPayment,
        totalCost,
        totalDue,
        netBalance,
        profit,
      },

      filtered: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        cost: totalCost,
        due: totalDue,
        profit,
      },

      counts: {
        totalPurchases: totalPurchasesCount,
        totalExpenses: totalExpensesCount,
        totalSales: totalSalesCount,
        totalPayments: totalPaymentsCount,
      },

      today: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      thisWeek: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      thisMonth: {
        purchase: totalPurchase,
        expense: totalExpense,
        sales: totalSales,
        payment: totalPayment,
        due: totalDue,
      },

      stock: {
        totalProducts,
        inStock,
        outOfStock,
        lowStock,
        totalStockValue,
      },

      insights: {
        topSellingProduct,
        topExpenseCategory,
        topPaymentMethod,
      },
    };

    return NextResponse.json({ success: true, data: overview });
  } catch (error: any) {
    console.error("GET /api/overview error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch overview",
        error: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
