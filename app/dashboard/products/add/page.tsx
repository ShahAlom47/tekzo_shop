"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ProductFormData } from "@/interfaces/productInterface";
import ProductForm from "@/Components/Products/ProductForm";
import { addProduct } from "@/lib/allApiRequest/productRequest/productRequest";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      const res = await addProduct({ ...data });

      if (!res.success) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h1>

      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddProduct;