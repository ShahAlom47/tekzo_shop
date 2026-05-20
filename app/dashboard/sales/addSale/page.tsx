"use client";

import CustomerSelect from "@/Components/CommonComponents/CustomerSelect";
import ProductSelect from "@/Components/Sales/ProductSelect";
import { useCustomers } from "@/hook/useCustomers";
import { Customer } from "@/Interfaces/customerInterface";
import { ProductUnit } from "@/Interfaces/productInterface";
import { AddSaleRequest } from "@/Interfaces/saleInterfaces";
import { addSale } from "@/lib/allApiRequest/salesRequest/salesRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unit: ProductUnit;
  price: number;
  costPrice: number;
  totalPrice: number;
  totalCost: number;
}

const AddSalePage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const { data: customers } = useCustomers();

  // ===============================
  // Calculations
  // ===============================

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  const totalCost = cart.reduce(
    (acc, item) => acc + item.quantity * (item.costPrice || 0),
    0,
  );

  const finalAmount = totalAmount - discount;

  const totalProfit = finalAmount - totalCost;

  const dueAmount = Math.max(finalAmount - paidAmount, 0);



  // ===============================
  // Submit Sale
  // ===============================

 const handleSubmit = async () => {
  if (cart.length === 0) {
    toast.error("Please add product first");
    return;
  }

  if (dueAmount > 0 && !selectedCustomer) {
    toast.error("Please select customer for due amount");
    return;
  }

  setBtnLoading(true);

  const saleData: AddSaleRequest = {
    sale: {
      saleNumber: `SALE-${Date.now()}`,

      customerId: selectedCustomer?._id?.toString(),

      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,

        sellingPrice: item.price,
        costPrice: item.costPrice,

        totalPrice: item.quantity * item.price,
        totalCost: item.quantity * item.costPrice,

        profit:
          item.quantity * item.price -
          item.quantity * item.costPrice,
      })),

      discount,
      totalAmount: finalAmount,
      totalCost,
      totalProfit,
    },

    // 👉 payment only if paidAmount > 0
    ...(paidAmount > 0 && {
      payment: {
        amount: paidAmount,
        method: "CASH", // later dynamic korte parba
        note: "Sale payment",
      },
    }),
  };


  const res = await addSale(saleData);

  if (!res?.success) {
    setBtnLoading(false);
    toast.error(res?.message || "Failed");
    return;
  }

  setBtnLoading(false);
  toast.success(res?.message || "Sale Added Successfully");

  // RESET
  setCart([]);
  setPaidAmount(0);
  setDiscount(0);
  setSelectedCustomer(null);
};

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧾 Add New Sale</h1>

      {/* Customer Select */}
      <CustomerSelect
        customers={customers || []}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />

      {/* Product Select */}
      <ProductSelect cart={cart} setCart={setCart} />

      {/* ================= Cart Table ================= */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{item.name}</td>

                <td className="p-3 text-center">{item.quantity}</td>

                <td className="p-3 text-center">৳ {item.price}</td>

                <td className="p-3 text-right">
                  ৳ {item.quantity * item.price}
                </td>

                <td className="p-3 text-right">
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => {
                      const newCart = [...cart];
                      newCart.splice(index, 1);
                      setCart(newCart);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {cart.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No products added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Summary Section ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="font-semibold text-lg">Payment</h2>

          <div>
            <label className="block text-sm mb-1">Discount</label>

            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paid Amount</label>

            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-3">
          <h2 className="font-semibold text-lg">Summary</h2>

          <div className="flex justify-between">
            <span>Total</span>
            <span>৳ {totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>৳ {discount}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Final Total</span>
            <span>৳ {finalAmount}</span>
          </div>

          <div className="flex justify-between text-blue-600">
            <span>Profit</span>
            <span>৳ {totalProfit}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Due</span>
            <span>৳ {dueAmount}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={btnLoading}
            className={`w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 mt-4 ${btnLoading ? "opacity-25" : "opacity-100"}`}
          >
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalePage;
