
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPurchaseCollection } from "@/lib/database/db_collections";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      date,
      memos,
      transportCost,
      otherCost,
      note,
      createdBy,
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

    // 🔹 Validate memos
    for (const memo of memos) {
      if (!memo.memoNumber || !memo.amount) {
        return NextResponse.json(
          { success: false, message: "Invalid memo data" },
          { status: 400 }
        );
      }
    }

    const purchaseCollection = await getPurchaseCollection();

    // ✅ DATE FIX
    const nowISO = new Date().toISOString();

    const purchaseDateISO = date
      ? new Date(date).toISOString()
      : nowISO;

    // 🔹 Calculate totals
    const productTotal = memos.reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0
    );

    const grandTotal =
      productTotal +
      Number(transportCost || 0) +
      Number(otherCost || 0);

    // ✅ Create Purchase
    const purchaseData  = {
      date: purchaseDateISO,
      memos,
      productTotal,
      transportCost: Number(transportCost || 0),
      otherCost: Number(otherCost || 0),
      grandTotal,
      note: note || "",
      createdBy: createdBy ? String(createdBy) : undefined,
      createdAt: nowISO,
    } ;

    const result = await purchaseCollection.insertOne(purchaseData);

    if (!result?.insertedId) {
      return NextResponse.json({
        success: false,
        message: "Failed",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Purchase added successfully",
      purchaseId: result.insertedId.toString(),
    });

  } catch (error: any) {
    console.error("PURCHASE ERROR:", error);

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