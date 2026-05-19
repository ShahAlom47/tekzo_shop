import { getFundCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    // ✅ Validation
    if (!source || !type || !amount) {
      return NextResponse.json(
        { success: false, message: "Source, Type, Amount required" },
        { status: 400 }
      );
    }

    const fundCollection = await getFundCollection();

    // ✅ Final object
    const newFundRecord = {
      source,
      type,
      amount: Number(amount),
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
      category: category || "Others",
      note: note || "",
      paymentMethod: paymentMethod || "Cash",
      relatedParty: relatedParty || "",
      tags: tags || [],
      createdAt: new Date(),
    };

    const result = await fundCollection.insertOne(newFundRecord);

    return NextResponse.json({
      success: true,
      message: "Fund record added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Add Fund Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}