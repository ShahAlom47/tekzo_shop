import { getCustomerCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { Customer } from "@/Interfaces/customerInterface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      address,
      customerType,
      openingBalance,
      creditLimit,
      isActive,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const collection = await getCustomerCollection();

    // 🔥 Duplicate Check
    const existingCustomer = await collection.findOne({ phone });

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer with this phone already exists",
        },
        { status: 409 }
      );
    }

    // ✅ 🔥 DATE FIX START
    const nowISO = new Date().toISOString();
    // ✅ 🔥 DATE FIX END

    const newCustomer = {
      name,
      phone,
      email: email || "",
      address: address || "",
      customerType: customerType || "REGULAR",
      openingBalance: openingBalance || 0,
      creditLimit: creditLimit || 0,
      isActive: isActive ?? true,

      // ✅ ISO string
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const result = await collection.insertOne(newCustomer);

    const createdCustomer: Customer = {
      _id: result.insertedId,
      ...newCustomer,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Customer added successfully",
        data: createdCustomer,
      },
      { status: 201 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}