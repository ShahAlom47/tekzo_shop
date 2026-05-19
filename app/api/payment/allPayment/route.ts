/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentsCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const paymentCollection = await getPaymentsCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    // 🔹 Params
    const month = url.searchParams.get("month"); // format: YYYY-MM

    // 🔹 Filter
    const filter: any = {};

    // ✅ Month filter (ISO string safe)
    if (month) {
      const start = `${month}-01T00:00:00.000Z`;

      // next month calculate
      const [year, m] = month.split("-").map(Number);
      const nextMonth = new Date(year, m, 1);
      const end = nextMonth.toISOString(); // next month start

      filter.paymentDate = {
        $gte: start,
        $lt: end, // 🔥 important (less than next month)
      };
    }

    // 🔹 Get paginated data
    const payments = await paymentCollection
      .find(filter)
      .sort({ paymentDate: -1 }) // string ISO works perfectly
      .skip(skip)
      .limit(pageSize)
      .toArray();

    // 🔹 Total documents
    const total = await paymentCollection.countDocuments(filter);

    // 🔹 Total Amount (Summary)
    const totalAmountAgg = await paymentCollection
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    return NextResponse.json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),
      summary: {
        totalAmount,
      },
    });
  } catch (error: any) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve payments",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}