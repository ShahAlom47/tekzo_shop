/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getCategoryCollection, getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { Product } from "@/Interfaces/productInterface";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productCollection = await getProductCollection();
    const isDashboard = req.headers.get("x-from-dashboard") === "true";

 

    // 🔹 Pagination
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json({ success: false, message: "Invalid pagination params" }, { status: 400 });
    }

    // 🔹 Query params
    const searchTrim = url.searchParams.get("searchTrim")?.trim() || "";
    const sort = url.searchParams.get("sort") || "asc";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const categoryId = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const stockParam = url.searchParams.get("stock"); // in-stock / out-of-stock / number

    // 🔹 Category slug → categoryId
    // let categoryId: string | null = null;
    // if (categorySlug) {
    //   const categoryCollection = await getCategoryCollection();
    //   const categoryDoc = await categoryCollection.findOne({ slug: categorySlug });
    //   if (categoryDoc?._id) categoryId = categoryDoc._id.toString();
    // }

    // 🔹 Build filter
    const filter: any = { isDeleted: { $ne: true } }; // ignore deleted

    // --- Search
    if (searchTrim) {
      const regex = { $regex: searchTrim, $options: "i" };
      const orConditions: any[] = [
        { name: regex },
        { slug: regex },
        { brand: regex },
        { productCode: regex },
      ];
      try {
        const id = new ObjectId(searchTrim);
        orConditions.push({ _id: id });
      } catch {}
      filter.$or = orConditions;
    }

    // --- Category filter
    if (categoryId) filter.categoryId = categoryId;

    // --- Brand filter
    if (brand && brand !== "All Brands") filter.brand = { $regex: brand.trim(), $options: "i" };

    // --- Price filter
    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
    }

    // --- Stock filter
    if (stockParam === "in-stock") filter.currentStock = { $gt: 0 };
    else if (stockParam === "out-of-stock") filter.currentStock = { $lte: 0 };
    else if (stockParam && !isNaN(Number(stockParam))) filter.currentStock = { $gte: Number(stockParam) };

  
 

    // 🔹 Sorting
    const sortQuery: any = {};
    if (isDashboard) sortQuery.createdAt = -1;
    else if (sort === "asc") sortQuery.sellingPrice = 1;
    else if (sort === "desc") sortQuery.sellingPrice = -1;
    else if (sort === "newest") sortQuery.createdAt = -1;
    else if (sort === "popular") sortQuery["ratings.count"] = -1;

    // 🔹 Fetch products + total count in parallel
    const [products, total] = await Promise.all([
      productCollection.find(filter).sort(sortQuery).skip(skip).limit(pageSize).toArray() as Promise<Product[]>,
      productCollection.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
     
        currentPage,
        pageSize,
        totalData: total,
        totalPages: Math.ceil(total / pageSize),
      
    });

  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve products", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}