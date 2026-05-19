import { getSalesCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params as Promise
) {
  try {
    const { id } = await params; // await the params
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    const salesCollection = await getSalesCollection();

    const deleteResult = await salesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Sale not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sale deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/sales/delete/[id]:", error);
    return NextResponse.json(
      {
        message: "Failed to delete sale",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
