"use client";

import { CartItem } from "@/app/dashboard/sales/addSale/page";
import CustomerSelect from "@/Components/CommonComponents/CustomerSelect";
import ProductSelect from "@/Components/Sales/ProductSelect";
import { useCustomers } from "@/hook/useCustomers";
import { Customer } from "@/interfaces/customerInterface";
import React, { useMemo, useState } from "react";

type Props = {
  onSuccess?: () => void;
};

const ReturnForm = ({ onSuccess }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [saleNumber, setSaleNumber] = useState("");
  const [note, setNote] = useState("");

  const { data: customers } = useCustomers();

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [cart]);

  const removeItem = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!cart.length) return alert("No product selected");

    const payload = {
      saleNumber,
      customerId: selectedCustomer?._id,
      products: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalAmount: item.quantity * item.price,
      })),
      totalAmount,
      note,
    };

    console.log("RETURN PAYLOAD =>", payload);

    // API CALL HERE
    // await createReturn(payload)

    // reset
    setCart([]);
    setSaleNumber("");
    setNote("");
    setSelectedCustomer(null);

    onSuccess?.(); // refresh table
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">

      {/* Top Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded-lg"
          placeholder="Sale Number"
          value={saleNumber}
          onChange={(e) => setSaleNumber(e.target.value)}
        />

        <CustomerSelect
          customers={customers || []}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      </div>

      {/* Product Select */}
      <ProductSelect cart={cart} setCart={setCart} />

      {/* Cart Items */}
      <div className="space-y-2">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center border p-2 rounded-lg"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.price} TK</p>
            </div>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQty(item.productId, Number(e.target.value))}
              className="border w-16 text-center"
            />

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Note */}
      <textarea
        className="border p-2 w-full rounded-lg"
        placeholder="Return Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Footer */}
      <div className="flex justify-between items-center">
        <p className="font-bold text-red-500">
          Total: {totalAmount} TK
        </p>

        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Submit Return
        </button>
      </div>
    </div>
  );
};

export default ReturnForm;