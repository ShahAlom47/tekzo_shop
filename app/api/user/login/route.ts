import { NextRequest, NextResponse } from "next/server";
import { getUserCollection } from "@/lib/database/db_collections";

export async function POST(req: NextRequest) {
  try {
    // body data
    const { phone, password } = await req.json();

    // validation
    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and password are required",
        },
        { status: 400 }
      );
    }

    // collection
    const usersCollection = await getUserCollection();

    // user find
    const user = await usersCollection.findOne({ phone });

    // user not found
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // password check
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password not match",
        },
        { status: 401 }
      );
    }
    // phone check
    if (user.phone !== phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number not match",
        },
        { status: 401 }
      );
    }

    // success response
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",

        data: {
          _id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}