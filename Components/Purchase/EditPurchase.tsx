'use client'

import { useState } from "react";
import PurchaseForm from "@/Components/Purchase/PurchaseForm";
import { Purchase } from "@/Interfaces/purchaseInterface";
import toast from "react-hot-toast";
import { editPurchase } from "@/lib/allApiRequest/purchaseRequest/purchaseRequest";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  initialData: Purchase | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (updated: Purchase) => void;
}

const EditPurchaseModal = ({ initialData, isOpen, onClose, onUpdated }: Props) => {
  const [loading, setLoading] = useState(false);
  const id = initialData?._id?.toString() || ""; // Ensure we have an ID to work with
    const queryClient = useQueryClient();

  const handleEdit = async (data: Purchase) => {
    if (!initialData) return;
    try {
      setLoading(true);
      const res = await editPurchase(id, data); // assume your Purchase has _id
      if (!res?.success) {
        toast.error(res?.message || "Failed to update purchase");
      } else {
        toast.success("Purchase updated successfully");
          queryClient.invalidateQueries({
           queryKey: ["purchases"],
        });
        onClose(); // close modal after success
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // don't render if modal is closed

  return (

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-2 relative">
    


        <PurchaseForm
          initialData={initialData}
          onSubmit={handleEdit}
        />
      </div>
  
  );
};

export default EditPurchaseModal;