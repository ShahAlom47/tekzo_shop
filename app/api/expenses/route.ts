import { NextRequest, NextResponse } from "next/server";
import { getExpensesCollection } from "@/lib/database/db_collections";

// 🔹 Strict Sort Type
type SortOption = "newest" | "oldest" | "high" | "low";

// 🔹 Params interface
export interface GetExpensesParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  category?: string;
  month?: string; // YYYY-MM
  sort: SortOption;
}

export async function GET(req: NextRequest) {
  try {
    const expenseCollection = await getExpensesCollection();
    const { searchParams } = new URL(req.url);

    const currentPage = Number(searchParams.get("currentPage")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const searchTrim = searchParams.get("searchTrim");
    const category = searchParams.get("category");
    const month = searchParams.get("month");
    const sort = (searchParams.get("sort") || "newest") as SortOption;

    const skip = (currentPage - 1) * pageSize;

    // 🔹 Build Query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
  if (searchTrim) {
  query.$or = [
    { title: { $regex: searchTrim, $options: "i" } },
    { category: { $regex: searchTrim, $options: "i" } },
  ];
}
    if (category) query.category = category;

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.expenseDate = { $gte: start.toISOString(), $lt: end.toISOString() };
    }

    // 🔹 Sort Logic
    let sortOption: Record<string, 1 | -1> = { expenseDate: -1 }; // default newest
    if (sort === "oldest") sortOption = { expenseDate: 1 };
    if (sort === "high") sortOption = { amount: -1 };
    if (sort === "low") sortOption = { amount: 1 };

    // 🔹 Get Paginated Data
    const expenses = await expenseCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    // 🔹 Total Count
    const totalCount = await expenseCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    // 🔹 Total Amount
    const totalResult = await expenseCollection
      .aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray();

    const totalAmount = totalResult[0]?.total || 0;

    // 🔹 Final Response
    return NextResponse.json({
      success: true,
      message: "Expenses fetched successfully",
      data: { expenses, totalAmount },
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}