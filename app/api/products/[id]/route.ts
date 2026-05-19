/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid or missing ID", success: false },
        { status: 400 }
      );
    }

    const productCollection = await getProductCollection();

    const product = await productCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product fetched successfully",
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/products/[id]:", error);

    return NextResponse.json(
      {
        message: "An error occurred while fetching the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}