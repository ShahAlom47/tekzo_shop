/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getPaymentsCollection } from "@/lib/database/db_collections";
import { PaymentType } from "@/Interfaces/paymentInterface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerId,
      saleId,
      amount,
      method = "CASH",
      note,
      paymentDate,
      transactionId,
      createdBy,
    } = body;

    // 🔥 helper → সব ID string
    const toStr = (val: any) => (val ? val.toString() : "");

    // 🔴 Validation
    if (!customerId) {
      return NextResponse.json(
        { success: false, message: "Customer is required" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const paymentsCollection = await getPaymentsCollection();

    // ✅ Detect payment type
    const paymentType = (saleId
      ? "SALE_PAYMENT"
      : "DUE_PAYMENT") as PaymentType;

    // ✅ DATE FIX
    const nowISO = new Date().toISOString();

    // ✅ safe paymentDate
    const paymentDateISO = paymentDate
      ? new Date(paymentDate).toISOString()
      : nowISO;

    // ✅ Create Payment
    const paymentData = {
      customerId: toStr(customerId), // ✅ string
      saleId: saleId ? toStr(saleId) : undefined, // ✅ string
      amount,
      method,
      type: paymentType,
      note: note || "",
      transactionId: transactionId || null,
      paymentDate: paymentDateISO,
      createdBy: createdBy ? toStr(createdBy) : undefined, // ✅ string
      createdAt: nowISO,
    };

    const result = await paymentsCollection.insertOne(paymentData);

    if (!result?.insertedId) {
      return NextResponse.json({
        success: false,
        message: "Failed",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment added successfully",
      paymentId: result.insertedId.toString(), // ✅ string return
    });

  } catch (error: any) {
    console.error("PAYMENT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}