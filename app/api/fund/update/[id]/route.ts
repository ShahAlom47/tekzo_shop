import { getFundCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ✅ ObjectId validation
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Fund ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      source,
      type,
      amount,
      date,
      category,
      note,
      paymentMethod,
      relatedParty,
      tags,
    } = body;

    // ✅ validation (minimum required)
    if (!source || !type || !amount || !date || !category) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    if (!["IN", "OUT"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 }
      );
    }

    if (Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const fundCollection = await getFundCollection();

    // ✅ update object (ISO format)
    const updatedFund = {
      source,
      type,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      category,
      note: note || "",
      paymentMethod: paymentMethod || null,
      relatedParty: relatedParty || null,
      tags: tags || [],
      updatedAt: new Date().toISOString(),
    };

    const result = await fundCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFund }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Fund record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fund record updated successfully",
    });
  } catch (error) {
    console.error("Update Fund Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}