/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ProductFormData } from "@/Interfaces/productInterface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    // 🔁 Numeric fields convert
    const numericFields: (keyof ProductFormData)[] = [
      "costPrice",
      "sellingPrice",
      "openingStock",
      "currentStock",
    ];

    for (const field of numericFields) {
      const value = body[field];

      if (value !== undefined) {
        const parsedValue = Number(value);

        if (isNaN(parsedValue)) {
          return NextResponse.json(
            { message: `Invalid ${field} format`, success: false },
            { status: 400 }
          );
        }

        body[field] = parsedValue as any;
      }
    }

    // ✅ 🔥 DATE FIX START

    const nowISO = new Date().toISOString();

    // force ISO format
    body.createdAt = body.createdAt
      ? new Date(body.createdAt).toISOString()
      : nowISO;

    body.updatedAt = nowISO;

    // ✅ 🔥 DATE FIX END

    const productCollection = await getProductCollection();
    const addResult = await productCollection.insertOne(body);

    if (!addResult.acknowledged) {
      return NextResponse.json(
        { message: "Failed to add product", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Product added successfully",
        success: true,
        insertedId: addResult.insertedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/products/add:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const duplicateValue = error.keyValue?.[duplicateField];
      return NextResponse.json(
        {
          message: `A product with the same ${duplicateField} "${duplicateValue}" already exists.`,
          success: false,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "An error occurred while adding the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}