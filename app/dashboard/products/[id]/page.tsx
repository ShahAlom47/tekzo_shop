/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Product, ProductFormData } from "@/Interfaces/productInterface";
import ProductForm from "@/Components/Products/ProductForm";
import {
  getSingleProduct,
  updateProduct,
} from "@/lib/allApiRequest/productRequest/productRequest";

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const productId = params?.id as string;

  // ✅ Fetch Single Product
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getSingleProduct(productId),
    enabled: !!productId,
  });

  

  // 🔄 Loading state
  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  // ❌ Error state
  if (isError || !data?.success) {
    return (
      <p className="p-6 text-red-500">
        Failed to load product
      </p>
    );
  }

  const product = data.data as Product;

  const handleUpdate = async (formData: ProductFormData) => {
  try {
    const res = await updateProduct(productId, formData);

    if (!res?.success) {
      toast.error("Failed to update product");
      return;
    }

    toast.success("Product updated successfully!");

    queryClient.invalidateQueries({
      queryKey: ["products"],
    });

    router.push("/dashboard/products");

  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
  }
};

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Product
      </h1>

      <ProductForm
        product={product}
        // isSubmitting={mutation.isPending}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditProduct;