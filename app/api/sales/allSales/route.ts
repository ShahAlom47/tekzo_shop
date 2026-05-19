/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getSalesCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const salesCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    );
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const status = url.searchParams.get("status");

    // 🔹 Filter
    const filter: any = {};

    if (searchTrim) {
      const orConditions: any[] = [
        { saleNumber: { $regex: searchTrim, $options: "i" } },
        { customerId: { $regex: searchTrim, $options: "i" } },
      ];
      try {
        const id = new ObjectId(searchTrim);
        orConditions.push({ _id: id });
      } catch {}
      filter.$or = orConditions;
    }

    // 🔹 Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // =========================================
    // 🔥 FULL DATA (for summary calculation)
    // =========================================
    const allSales = await salesCollection.find(filter).toArray();

    const allSaleIds = allSales.map((s) => s._id.toString());

    const allPayments = await paymentsCollection
      .find({ saleId: { $in: allSaleIds } })
      .toArray();

    // 🔹 Payment Map (O(n))
    const paymentMap = new Map<string, number>();

    for (const p of allPayments) {
      const key = p.saleId?.toString();
      if (key) {
        paymentMap.set(key, (paymentMap.get(key) || 0) + p.amount);
      }
    }

    // 🔹 Attach paid & due
    const allSalesWithPayment = allSales.map((sale) => {
      const paid = paymentMap.get(sale._id.toString()) || 0;
      const due = Math.max(sale.totalAmount - paid, 0);

      return {
        ...sale,
        paidAmount: paid,
        dueAmount: due,
      };
    });

    // 🔹 Status filter (applied globally)
    const finalSales = allSalesWithPayment.filter((s) => {
      if (!status || status === "all") return true;
      if (status === "paid") return s.dueAmount === 0;
      if (status === "due") return s.dueAmount > 0;
      if (status === "unpaid") return s.paidAmount === 0;
      return true;
    });

    // =========================================
    // 🔥 SUMMARY
    // =========================================
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let totalProfit = 0;

    for (const sale of finalSales) {
      totalRevenue += sale.totalAmount;
      totalPaid += sale.paidAmount;
      totalDue += sale.dueAmount;
      totalProfit += sale.totalProfit || 0;
    }

    const summary = {
      totalSales: finalSales.length,
      totalRevenue,
      totalPaid,
      totalDue,
      totalProfit,
    };

    // =========================================
    // 🔹 PAGINATION (after filtering)
    // =========================================
    const paginatedSales = finalSales
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(skip, skip + pageSize);

    return NextResponse.json({
      success: true,
      message: "Sales retrieved successfully",
      data: paginatedSales,
      summary, // ✅ added
      currentPage,
      pageSize,
      totalData: finalSales.length,
      totalPages: Math.ceil(finalSales.length / pageSize),
    });
  } catch (error: any) {
    console.error("GET /api/sales error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve sales",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}