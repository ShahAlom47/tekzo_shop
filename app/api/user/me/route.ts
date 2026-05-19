import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { getUserCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    const usersCollection = await getUserCollection();

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return NextResponse.json(
        { success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }
}