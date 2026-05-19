/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCustomerCollection,
  getSalesCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const customerCollection = await getCustomerCollection();
    const saleCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("searchTrim")?.trim() || "";

    const filter: any = { isDeleted: { $ne: true } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const total = await customerCollection.countDocuments(filter);

    const customers = await customerCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    if (!customers.length) {
      return NextResponse.json({
        success: true,
        total,
        totalPages: Math.ceil(total / limit),
        data: [],
      });
    }

    const customerIds = customers.map((c) => c._id.toString());

    // ✅ SALES
    const sales = await saleCollection
      .find({
        customerId: { $in: customerIds },
      })
      .toArray();

    // ✅ SALE IDS
    const saleIds = sales.map((s) => s._id.toString());

    // ✅ PAYMENTS (both types)
    const payments = await paymentsCollection
      .find({
        $or: [
          { saleId: { $in: saleIds } }, // sale payment
          { customerId: { $in: customerIds } }, // due payment
        ],
      })
      .toArray();

    // 🔥 MAIN LOGIC
    const customersWithDue = customers.map((customer) => {
      const customerSales = sales.filter(
        (s) =>
          s.customerId && s.customerId.toString() === customer._id.toString(),
      );

      // ✅ total sales
      const totalSales = customerSales.reduce(
        (sum, s) => sum + (s.totalAmount || 0),
        0,
      );

      // ✅ total paid (sale + due)
      const totalPaid = payments
        .filter(
          (p) =>
            p.customerId && p.customerId.toString() === customer._id.toString(),
        )
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const currentDue =
        (customer.openingBalance || 0) + totalSales - totalPaid;

      return {
        _id: customer._id,
        name: customer.name,
        address: customer?.address,
        phone: customer.phone,
        isActive: customer?.isActive,
        currentDue: currentDue < 0 ? 0 : currentDue, // safety
      };
    });

    return NextResponse.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: customersWithDue,
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch customers",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
