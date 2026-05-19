import { getExpensesCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID", success: false },
        { status: 400 },
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 },
      );
    }

    const { title, amount, category, note, expenseDate } = body;

    // 🔹 validation
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Expense ID is required" },
        { status: 400 },
      );
    }

    if (!title || !amount || !category || !expenseDate) {
      return NextResponse.json(
        { success: false, message: "All required fields are missing" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    const expenseCollection = await getExpensesCollection();

    // 🔹 update document
    const updatedExpense = {
      title,
      amount: Number(amount),
      category,
      note: note || "",
      expenseDate: new Date(expenseDate).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await expenseCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedExpense },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
