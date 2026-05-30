import { NextRequest, NextResponse } from "next/server";
import { getSalesCollection } from "@/lib/database/db_collections";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      saleNumber,
      customerId,
      products,
      totalQuantity,
      totalAmount,
      totalCost,
      totalProfit,
      note,
    } = body;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products provided" },
        { status: 400 }
      );
    }

    const salesCollection = await getSalesCollection();

    const nowISO = new Date().toISOString();

    const returnData = {
      saleNumber: saleNumber || null,
      customerId: customerId || null,

      products,

      totalQuantity: totalQuantity || 0,
      totalAmount: totalAmount || 0,
      totalCost: totalCost || 0,
      totalProfit: totalProfit || 0,

      note: note || "",

      createdAt: nowISO,
    };

    const result = await salesCollection.insertOne(returnData);

    return NextResponse.json({
      success: true,
      message: "Return saved successfully",
      returnId: result.insertedId.toString(),
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("RETURN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}