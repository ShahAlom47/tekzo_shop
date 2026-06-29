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

const overall = {
  totalSales: 0,
  totalProfit: 0,
  totalQuantity: 0,
  expense: 0,
  actualProfit: 0,
  collection: 0,
  due: 0,
  stockBuy: 0,
  remainingAmount: 0,
};

for (const sale of sales) {
  const month = new Date(sale.createdAt).getMonth();

  summary[month].totalSales += sale.totalAmount;

  summary[month].totalProfit += sale.totalProfit;

  const quantity = sale.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  summary[month].totalQuantity += quantity;
}
for (const expense of expenses) {
  const month = new Date(expense.expenseDate).getMonth();

  summary[month].expense += expense.amount;
}

for (const payment of payments) {
  const month = new Date(payment.paymentDate).getMonth();

  summary[month].collection += payment.amount;
}
for (const purchase of purchases) {
  const month = new Date(purchase.date).getMonth();

  summary[month].stockBuy += purchase.grandTotal;
}


for (const item of summary) {
  overall.totalSales += item.totalSales;
  overall.totalProfit += item.totalProfit;
  overall.totalQuantity += item.totalQuantity;
  overall.expense += item.expense;
  overall.actualProfit += item.actualProfit;
  overall.collection += item.collection;
  overall.due += item.due;
  overall.stockBuy += item.stockBuy;
  overall.remainingAmount += item.remainingAmount;
}

return NextResponse.json({
  success: true,
  data: {
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
      { status: 500 }
    );
  }
}