import { getExpensesCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, amount, category, note, expenseDate } = body;

    // 🔹 validation
    if (!title || !amount || !category || !expenseDate) {
      return NextResponse.json(
        { success: false, message: "All required fields are missing" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const expenseCollection = await getExpensesCollection();

    // 🔹 create document
    const newExpense = {
      title,
      amount: Number(amount),
      category,
      note: note || "",
      expenseDate: new Date(expenseDate).toISOString(),
      createdAt: new Date().toISOString(),
    };

    const result = await expenseCollection.insertOne(newExpense);

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}