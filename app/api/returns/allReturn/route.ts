import { NextRequest, NextResponse } from "next/server";
import { getReturnCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const currentPage = Number(searchParams.get("currentPage")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const searchTrim = searchParams.get("searchTrim") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (currentPage - 1) * pageSize;

    const returnsCollection = await getReturnCollection()
   


    const query: Record<string, unknown> = {};

    // Search by saleNumber
    if (searchTrim) {
      query.saleNumber = {
        $regex: searchTrim,
        $options: "i",
      };
    }

    // Date filter
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        (query.createdAt as Record<string, string>).$gte =
          new Date(startDate).toISOString();
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        (query.createdAt as Record<string, string>).$lte =
          end.toISOString();
      }
    }

    const total = await returnsCollection.countDocuments(query);

    const data = await returnsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("GET RETURN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}