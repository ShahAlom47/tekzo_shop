import { NextRequest, NextResponse } from "next/server";
import { getUserCollection } from "@/lib/database/db_collections";
import { User } from "@/interfaces/userInterface";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json();

    // 🔥 validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    const cleanPhone = phone.toString().trim();

    // 🔥 check duplicate user
    const existingUser = await userCollection.findOne({
      phone: cleanPhone,
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // 🔥 simple user object (NO HASH)
    const newUser:User = {
      name,
      phone: cleanPhone,
      password, // ⚠️ plain text (simple system)
      role: "staff",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await userCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.insertedId.toString(),
        name,
        phone: cleanPhone,
        role: "staff",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}