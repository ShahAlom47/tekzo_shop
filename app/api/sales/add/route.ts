/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getSalesCollection,
  getProductCollection,
  getPaymentsCollection,
} from "@/lib/database/db_collections";
import { Sale, SaleProduct } from "@/Interfaces/saleInterfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sale, payment } = body;

    const {
      customerId,
      products,
      discount = 0,
      createdBy,
    } = sale;

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products provided" },
        { status: 400 }
      );
    }

    const productCollection = await getProductCollection();
    const salesCollection = await getSalesCollection();
    const paymentsCollection = await getPaymentsCollection();

    const saleProducts: SaleProduct[] = [];
    let totalAmount = 0;
    let totalCost = 0;

    // 🔥 ensure string helper
    const toStr = (val: any) => (val ? val.toString() : "");

    // 1️⃣ Validate stock & calculate totals
    for (const item of products) {
      const product = await productCollection.findOne({
        _id: new ObjectId(item.productId), // ✅ only here ObjectId needed
      });

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (product.currentStock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `${product.name} stock not enough` },
          { status: 400 }
        );
      }

      const sellingPrice = item.sellingPrice;
      const costPrice = product.costPrice;

      const totalPrice = item.quantity * sellingPrice;
      const itemTotalCost = item.quantity * costPrice;
      const profit = totalPrice - itemTotalCost;

      totalAmount += totalPrice;
      totalCost += itemTotalCost;

      saleProducts.push({
        productId: toStr(item.productId), // ✅ নিশ্চিত string
        productName: product.name,
        quantity: item.quantity,
        sellingPrice,
        costPrice,
        totalPrice,
        totalCost: itemTotalCost,
        profit,
      });
    }

    totalAmount = totalAmount - discount;
    const totalProfit = totalAmount - totalCost;

    // ✅ DATE FIX
    const nowISO = new Date().toISOString();

    // 2️⃣ Create Sale
    const saleData: Sale = {
      customerId: customerId ? toStr(customerId) : undefined, // ✅ string
      products: saleProducts,
      discount,
      totalAmount,
      totalCost,
      totalProfit,
      createdBy: createdBy ? toStr(createdBy) : undefined, // ✅ string
      createdAt: nowISO,
      saleNumber: `SALE-${Date.now()}`,
    };

    const saleResult = await salesCollection.insertOne(saleData);

    // 🔥 convert insertedId → string
    const saleIdStr = saleResult.insertedId.toString();

    // 3️⃣ Insert Payment
    if (payment && payment.amount > 0) {
      await paymentsCollection.insertOne({
        customerId: customerId ? toStr(customerId) : "", // ✅ string
        saleId: saleIdStr, // ✅ FIXED (string নিশ্চিত)

        amount: payment.amount,
        method: payment.method || "CASH",
        type: "SALE_PAYMENT",

        paymentDate: nowISO,
        createdAt: nowISO,

        note:
          payment.note ||
          (customerId ? "Sale payment" : "Walk-in payment"),
      });
    }

    // 4️⃣ Update stock
    for (const item of products) {
      await productCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        {
          $inc: {
            currentStock: -item.quantity,
            sold: item.quantity,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale created successfully",
      saleId: saleIdStr, // ✅ এখন string return
    });

  } catch (error: any) {
    console.error("SALE ERROR:", error);
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