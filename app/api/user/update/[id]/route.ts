/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/database/db_collections";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { fullName, role, isActive } = body;

    if (!fullName && !role && typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    const user = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // ✅ everyone can change name
    if (fullName) {
      updateData.fullName = fullName;
    }

    // ❌ OWNER restriction (only role & status block)
    if (user.role !== "OWNER") {
      if (role) updateData.role = role;
      if (typeof isActive === "boolean") updateData.isActive = isActive;
    }

    updateData.updatedAt = new Date().toISOString();

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}