import { getFundCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 important fix

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid ID is required", success: false },
        { status: 400 }
      );
    }

    const fundCollection = await getFundCollection();

    const result = await fundCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Fund record not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Fund record deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /fund/delete/[id]:", error);

    return NextResponse.json(
      {
        message: "An error occurred while deleting the fund record",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}