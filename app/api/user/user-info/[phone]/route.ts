/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getUserCollection } from "@/lib/database/db_collections";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await params;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required", success: false },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    // ✅ current user
    const currentUser = await userCollection.findOne({
      phone: phone,
      isDeleted: { $ne: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    let users: any[] = [];

    // ✅ যদি admin হয় → সব user
    if (currentUser.role === "OWNER") {
      users = await userCollection
        .find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .toArray();
    }

    return NextResponse.json({
      success: true,
      data: {
        currentUser,
        users, // admin হলে full list, না হলে empty []
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch users",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}