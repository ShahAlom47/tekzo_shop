"use client";

import { CartItem } from "@/app/dashboard/sales/addSale/page";
import { Product, ProductUnit } from "@/Interfaces/productInterface";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";



interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const units: ProductUnit[] = ["PCS", "KG", "LITER", "BOX", "Feet"];

const ProductSelect = ({ cart, setCart }: Props) => {
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<ProductUnit>("PCS");
  const [price, setPrice] = useState(0);

  // Fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getAllProduct({ currentPage: 1, limit: 10000 });
      return res.data as Product[];
    },
  });

  const allProducts = data || [];
  const selectedProduct = allProducts.find((p) => p._id.toString() === selectedId);

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    if (quantity <= 0) return;

    const total = quantity * price;

    const existing = cart.find((c) => c.productId.toString() === selectedProduct._id.toString());

    if (existing) {
      // Update existing cart item
      setCart(
        cart.map((c) =>
          c.productId.toString() === selectedProduct._id.toString()
            ? {
                ...c,
                quantity: c.quantity + quantity,
                unit,
                price,
                total: (c.quantity + quantity) * price,
              }
            : c
        )
      );
    } else {
      // Add new cart item
      setCart([
        ...cart,
        {
          productId: selectedProduct._id.toString(),
          name: selectedProduct.name,
          quantity,
          unit,
          price,
          costPrice: selectedProduct.costPrice, 
          totalPrice: total,
          totalCost: quantity * selectedProduct.costPrice,
        },
      ]);
    }

    // Reset inputs
    setSelectedId("");
    setQuantity(1);
    setUnit("PCS");
    setPrice(0);
  };

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p className="text-red-500">Error loading products.</p>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Products</h2>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Product Select */}
        <select
          value={selectedId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedId(id);

            const prod = allProducts.find((p) => p._id.toString() === id);
            setPrice(prod ? prod.sellingPrice : 0);
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">Select Product</option>
          {allProducts.map((p) => (
            <option
              key={p._id.toString()}
              value={p._id.toString()}
              disabled={p.currentStock === 0}
            >
              {p.name} - Stock: {p.currentStock} - ৳{p.sellingPrice}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded-lg"
          placeholder="Quantity"
        />

        {/* Unit */}
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as ProductUnit)}
          className="border p-2 rounded-lg"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Price */}
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 rounded-lg"
          placeholder="Unit Price"
        />
      </div>

      {/* Auto Total */}
      {selectedProduct && (
        <p className="text-right text-sm font-medium">
          Total: ৳ {quantity * price}
        </p>
      )}
    </div>
  );
};

export default ProductSelect;