/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getCustomerCollection,
  getSalesCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid customer ID", success: false },
        { status: 400 }
      );
    }

    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    const customerObjectId = new ObjectId(id);
    const customerIdStr = id; // 🔥 IMPORTANT

    // ✅ Customer
    const customer = await customerCollection.findOne({
      _id: customerObjectId,
      isDeleted: { $ne: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found", success: false },
        { status: 404 }
      );
    }

    // ✅ Sales (STRING MATCH)
    const sales = await saleCollection
      .find({ customerId: customerIdStr })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Payments (STRING MATCH)
    const payments = await paymentsCollection
      .find({ customerId: customerIdStr })
      .sort({ paymentDate: -1 })
      .toArray();


    // 🔹 SALE WISE CALCULATION
    const salesWithCalc = sales.map((sale) => {
      const saleIdStr = sale._id?.toString();

      const relatedPayments = payments.filter(
        (p) =>
          p.saleId &&
          p.saleId.toString() === saleIdStr &&
          p.type === "SALE_PAYMENT"
      );

      const paidAmount = relatedPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      const dueAmount = Math.max(
        (sale.totalAmount || 0) - paidAmount,
        0
      );

      return {
        ...sale,
        paidAmount,
        dueAmount,
        payments: relatedPayments,
      };
    });

    // 🔹 PAYMENT SPLIT
    const salePayments = payments.filter(p => p.type === "SALE_PAYMENT");
    const duePayments = payments.filter(p => p.type === "DUE_PAYMENT");

    // 🔹 SUMMARY
    const totalSalesAmount = sales.reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    );

    const totalSalePaid = salePayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const totalDuePaid = duePayments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const totalPaid = totalSalePaid + totalDuePaid;

    const openingBalance = customer.openingBalance || 0;

    const currentDue =
      openingBalance + totalSalesAmount - totalPaid;

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          ...customer,
          currentDue,
        },

        summary: {
          totalSales: sales.length,
          totalSalesAmount,
          totalPaid,
          totalSalePaid,
          totalDuePaid,
          openingBalance,
          currentDue,
        },

        sales: salesWithCalc,
        paymentHistory: payments,
        salePayments,
        duePayments,
      },
    });

  } catch (error: any) {
    console.error("Error fetching customer:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch customer",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}