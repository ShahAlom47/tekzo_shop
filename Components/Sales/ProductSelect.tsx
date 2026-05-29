"use client";

import { CartItem } from "@/app/dashboard/sales/addSale/page";
import { Product, ProductUnit } from "@/interfaces/productInterface";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Select from "react-select";

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

  const allProducts = (data || []).filter(
    (p): p is Product & { _id: string } => Boolean(p._id)
  );

  const selectedProduct = allProducts.find(
    (p) => p._id.toString() === selectedId
  );

  // react-select options
  const productOptions = allProducts.map((p) => ({
    value: p._id.toString(),
    label: `${p.name} - Stock: ${p.currentStock} - ৳${p.sellingPrice}`,
    product: p,
  }));

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    if (quantity <= 0) return;

    const productId = selectedProduct._id.toString();
    const total = quantity * price;

    const existing = cart.find(
      (c) => c.productId.toString() === productId
    );

    if (existing) {
      setCart(
        cart.map((c) =>
          c.productId.toString() === productId
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
      setCart([
        ...cart,
        {
          productId,
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

    // reset
    setSelectedId("");
    setQuantity(1);
    setUnit("PCS");
    setPrice(0);
  };

  if (isLoading) return <p>Loading products...</p>;
  if (isError)
    return <p className="text-red-500">Error loading products.</p>;

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* SEARCH + SELECT */}
        <div className="md:col-span-2">
          <Select
            options={productOptions}
            value={
              productOptions.find((o) => o.value === selectedId) || null
            }
            onChange={(option) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const opt = option as any;

              setSelectedId(opt?.value || "");

              if (opt?.product) {
                setPrice(opt.product.sellingPrice);
              }
            }}
            isSearchable
            placeholder="Search & select product..."
          />
        </div>

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

      {/* Total */}
      {selectedProduct && (
        <p className="text-right text-sm font-medium">
          Total: ৳ {quantity * price}
        </p>
      )}
    </div>
  );
};

export default ProductSelect;