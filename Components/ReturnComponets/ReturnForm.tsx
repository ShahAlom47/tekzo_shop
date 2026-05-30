"use client";

import { CartItem } from "@/app/dashboard/sales/addSale/page";
import CustomerSelect from "@/Components/CommonComponents/CustomerSelect";
import ProductSelect from "@/Components/Sales/ProductSelect";
import { useCustomers } from "@/hook/useCustomers";
import { Customer } from "@/interfaces/customerInterface";
import { addReturn } from "@/lib/allApiRequest/returnRequest/returnRequest";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onSuccess?: () => void;
};

const ReturnForm = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [saleNumber, setSaleNumber] = useState("");
  const [note, setNote] = useState("");

  const { data: customers } = useCustomers();

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }, [cart]);

  const removeItem = (productId: string) => {
    setCart((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

const handleSubmit = async () => {
  if (!cart.length) return alert("No product selected");

  setLoading(true);

  try {
    const products = cart.map((item) => {
      const totalPrice = item.quantity * item.price;

      // ধরলাম profit calculation simple (future backend better হবে)
      const costPrice = item.costPrice || 0;
      const totalCost = item.quantity * costPrice;
      const profit = totalPrice - totalCost;

      return {
        productId: item.productId,
        productName: item.name,

        quantity: item.quantity,

        sellingPrice: item.price,
        costPrice,

        totalPrice,
        totalCost,
        profit,
      };
    });

    const totalQuantity = products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    const totalAmount = products.reduce(
      (sum, p) => sum + p.totalPrice,
      0
    );

    const totalCost = products.reduce(
      (sum, p) => sum + p.totalCost,
      0
    );

    const totalProfit = products.reduce(
      (sum, p) => sum + p.profit,
      0
    );

    const payload = {
      saleNumber,
      products,

      totalQuantity,
      totalAmount,
      totalCost,
      totalProfit,

      note,
      createdAt: new Date().toISOString(),
    };


    const response = await addReturn(payload);
    if(!response?.success) {
        toast.error("Failed to add return");
        console.log("RETURN RESPONSE =>", response);
    } else {
        toast.success("Return added successfully");
    }   

    // reset
    setCart([]);
    setSaleNumber("");
    setNote("");
    setSelectedCustomer(null);

    onSuccess?.();

  } catch (error) {
    console.error(error);
    alert("Return failed!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Return Form</h2>

        <button
          onClick={() => setOpen(!open)}
          className={`px-4 py-2 rounded-lg text-white transition ${
            open ? "bg-gray-500" : "bg-blue-500"
          }`}
        >
          {open ? "Hide Form" : "Add Return"}
        </button>
      </div>

      {/* FORM */}
      {open && (
        <div className="space-y-4 pt-3 border-t">

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded-lg"
              placeholder="Sale Number (optional)"
              value={saleNumber}
              onChange={(e) => setSaleNumber(e.target.value)}
            />

            <CustomerSelect
              customers={customers || []}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>

          {/* Product */}
          <ProductSelect cart={cart} setCart={setCart} />

          {/* Cart */}
          <div className="space-y-2">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400">No products added</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border p-2 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.price} TK
                    </p>
                  </div>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQty(
                        item.productId,
                        Number(e.target.value)
                      )
                    }
                    className="border w-16 text-center rounded"
                  />

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
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
              disabled={loading}
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-red-300"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Processing..." : "Submit Return"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ReturnForm;