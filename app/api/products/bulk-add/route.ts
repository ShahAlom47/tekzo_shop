import { Product } from "@/interfaces/productInterface";
import { getProductCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Array required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const products = body.map((item: Product) => ({
      name: item.name,
      slug: item.slug,
      productCode: String(item.productCode),

      brand: item.brand || "",
      categoryId: item.categoryId,
      supplierId: item.supplierId || "",

      costPrice: Number(item.costPrice),
      sellingPrice: Number(item.sellingPrice),

      currentStock: Number(item.currentStock || 0),

      unit: item.unit,
      status: item.status || "ACTIVE",

      // ✅ IMPORTANT FIX
      totalSold: 0,
      isDeleted: false,

      createdAt: now,
      updatedAt: now,
    }));

    const collection = await getProductCollection();

    // ❌ TypeScript fix (force as any)
    const result = await collection.insertMany(products as Product[]);

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} products added`,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}