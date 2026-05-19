/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFundCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const currentPage = Number(searchParams.get("currentPage")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const searchTrim = searchParams.get("searchTrim") || "";

    const skip = (currentPage - 1) * pageSize;

    const fundCollection = await getFundCollection();

    // ✅ Search Query
    const query: any = {};

    if (searchTrim) {
      query.$or = [
        { source: { $regex: searchTrim, $options: "i" } },
        { category: { $regex: searchTrim, $options: "i" } },
        { relatedParty: { $regex: searchTrim, $options: "i" } },
      ];
    }

    // ✅ Data + Count
    const [data, total] = await Promise.all([
      fundCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),

      fundCollection.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data,
        currentPage,
        totalPages: Math.ceil(total / pageSize),
      
    });
  } catch (error) {
    console.error("Get Fund Records Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
