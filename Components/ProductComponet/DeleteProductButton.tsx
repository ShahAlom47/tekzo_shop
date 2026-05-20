"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useConfirm } from "@/hook/useConfirm";
import { deleteProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  productId: string;
}

const DeleteProductButton = ({ productId }: Props) => {
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (!ok) return;

    try {
      setLoading(true);

      const res = await deleteProduct(productId);

      if (res?.success) {
        toast.success("Product deleted!");

        // ✅ Invalidate products query
        queryClient.invalidateQueries({
          queryKey: ["getCustomers"],
        });

      } else {
        toast.error("Failed to delete Customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {ConfirmModal}
    </>
  );
};

export default DeleteProductButton; 