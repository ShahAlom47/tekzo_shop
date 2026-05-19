/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getUserCollection } from "@/lib/database/db_collections";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { oldPassword, newPassword } = body;

    // ❌ validation
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    // 🔍 find user
    const user = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🔐 check old password
    const isMatch = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Old password incorrect" },
        { status: 400 }
      );
    }

    // 🔥 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔄 update password
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          passwordHash: hashedPassword,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}