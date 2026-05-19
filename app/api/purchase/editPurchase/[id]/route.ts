/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPurchaseCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid purchase ID", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      date,
      memos,
      transportCost,
      otherCost,
      note,
      updatedBy,
    } = body;

    // 🔴 Validation
    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date is required" },
        { status: 400 }
      );
    }

    if (!memos || !Array.isArray(memos) || memos.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one memo required" },
        { status: 400 }
      );
    }

    for (const memo of memos) {
      if (!memo.memoNumber || !memo.amount) {
        return NextResponse.json(
          { success: false, message: "Invalid memo data" },
          { status: 400 }
        );
      }
    }

    const purchaseCollection = await getPurchaseCollection();

    const purchaseDateISO = new Date(date).toISOString();

    // 🔹 Calculate totals
    const productTotal = memos.reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0
    );

    const grandTotal = productTotal + Number(transportCost || 0) + Number(otherCost || 0);

    // 🔹 Prepare updated data
    const updateData = {
      date: purchaseDateISO,
      memos,
      productTotal,
      transportCost: Number(transportCost || 0),
      otherCost: Number(otherCost || 0),
      grandTotal,
      note: note || "",
      updatedBy: updatedBy ? String(updatedBy) : undefined,
      updatedAt: new Date().toISOString(),
    };

    const updateResult = await purchaseCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Purchase updated successfully",
    });

  } catch (error: any) {
    console.error("PURCHASE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}