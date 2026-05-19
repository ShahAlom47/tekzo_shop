// /api/product/deleteproduct/[id]/route.ts
import { getExpensesCollection, getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
 { params }: { params: Promise< { id: string }> }
) {
  try {
    const { id } = await params;
    const expenseCollection = await getExpensesCollection();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    // MongoDB এর ObjectId তে রূপান্তর
    const filter = { _id: new ObjectId(id) };
    const result = await expenseCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "expense not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "expense deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /expenses/delete/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the expense",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
