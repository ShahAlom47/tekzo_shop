// /api/purchase/deletepurchase/[id]/route.ts
import { getPurchaseCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const purchaseCollection = await getPurchaseCollection();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    // MongoDB এর ObjectId তে রূপান্তর
    const result = await purchaseCollection.deleteOne({_id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Purchase not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Purchase deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /purchase/deletepurchase/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the purchase",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}