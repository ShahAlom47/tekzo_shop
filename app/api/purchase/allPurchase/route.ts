/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPurchaseCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { Purchase } from "@/Interfaces/purchaseInterface";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const purchaseCollection = await getPurchaseCollection();

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination params" },
        { status: 400 }
      );
    }

    // 🔹 Query params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const month = url.searchParams.get("month"); // 🔥 NEW

    // 🔹 Filter
    const filter: any = {};

    // 🔍 SEARCH
    if (searchTrim) {
      const regex = { $regex: searchTrim, $options: "i" };

      const orConditions: any[] = [
        { "memos.shopName": regex },
        { "memos.memoNumber": regex },
      ];

      if (ObjectId.isValid(searchTrim)) {
        orConditions.push({ _id: new ObjectId(searchTrim) });
      }

      filter.$or = orConditions;
    }

    // 📅 MONTH FILTER (priority)
    if (month) {
      const start = `${month}-01T00:00:00.000Z`;

      const [year, m] = month.split("-").map(Number);
      const nextMonth = new Date(year, m, 1);
      const end = nextMonth.toISOString();

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }
    // 📅 DATE FILTER (fallback)
    else if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = startDate;
      }

      if (endDate) {
        filter.date.$lt = endDate;
      }
    }

    // 🔽 SORT
    const sortQuery: any = { date: -1 };

    // 🚀 DATA QUERY
    const [purchases, total] = await Promise.all([
      purchaseCollection
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray() as Promise<Purchase[]>,

      purchaseCollection.countDocuments(filter),
    ]);

    // 🔥 🔥 SUMMARY (IMPORTANT)
    const summaryAgg = await purchaseCollection
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalProduct: { $sum: "$productTotal" },
            totalTransport: { $sum: "$transportCost" },
            totalOther: { $sum: "$otherCost" },
            grandTotal: { $sum: "$grandTotal" },
          },
        },
      ])
      .toArray();

    const summary = summaryAgg[0] || {
      totalProduct: 0,
      totalTransport: 0,
      totalOther: 0,
      grandTotal: 0,
    };

    return NextResponse.json({
      success: true,
      message: "Purchases retrieved successfully",
      data: purchases,
      currentPage,
      pageSize,
      totalData: total,
      totalPages: Math.ceil(total / pageSize),

      summary, // 🔥🔥 THIS IS YOUR TARGET
    });

  } catch (error: any) {
    console.error("GET /api/purchase/allPurchase error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve purchases",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}