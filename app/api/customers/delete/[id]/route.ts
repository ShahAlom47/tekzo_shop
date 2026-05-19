// app/api/customers/[id]/route.ts
import { getCustomerCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(
 req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = id.trim();

    if (!ObjectId.isValid(customerId)) {
      return NextResponse.json(
        { message: "Invalid ID", success: false },
        { status: 400 }
      );
    }

    const collection = await getCustomerCollection();

    const customer = await collection.findOne({ _id: new ObjectId(customerId) });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found", success: false },
        { status: 404 }
      );
    }

    await collection.updateOne(
      { _id: new ObjectId(customerId) },
      { $set: { isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ message: "Customer deleted successfully", success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { message: "Server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}