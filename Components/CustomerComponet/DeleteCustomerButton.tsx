"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useConfirm } from "@/hook/useConfirm";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";


interface Props {
  id: string;
  refetch?: () => void;
}

const DeleteCustomerButton = ({ id,refetch }: Props) => {
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();


  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Customer",
      message: "Are you sure you want to delete this customer?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (!ok) return;

    try {
      setLoading(true);

      const res = await deleteCustomer(id);
   

      if (res?.success) {
        toast.success(res?.message || "Customer deleted!");
        // call refetch only if it was provided
        refetch?.();

        // ✅ Invalidate customers query
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        });

      } else {
        toast.error(res?.message||"Failed to delete customer  ");
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

export default DeleteCustomerButton; 