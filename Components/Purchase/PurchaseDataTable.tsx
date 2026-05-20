'use client';
import { useConfirm } from "@/hook/useConfirm";
import { CustomTable } from "../CommonComponents/CustomTable";
import { Purchase } from "@/Interfaces/purchaseInterface";
import toast from "react-hot-toast";
import { deletePurchase } from "@/lib/allApiRequest/purchaseRequest/purchaseRequest";
import { useQueryClient } from "@tanstack/react-query";
import CustomModal from "../CommonComponents/CustomModal";
import { useState } from "react";
import EditPurchase from "./EditPurchase";

interface PropsType {
  purchases: Purchase[];
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchaseId: string) => void;
}

const PurchaseDataTable = ({ purchases, onEdit, onDelete }: PropsType) => {
  const {confirm,ConfirmModal } = useConfirm();
  const [open, setOpen] =useState(false);
  const [swlctEditData, setSwlctEditData] = useState<Purchase | null>(null);
    const queryClient = useQueryClient();


  const handleDelete = async (id: string) => {
  const ok = await confirm({
    title: "Delete Purchase",
    message: "Are you sure you want to delete this purchase?",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
  });

  if (ok) {
    // ✅ ইউজার Confirm করেছে, এখন delete কাজ করো
    await deletePurchase(id);
    toast.success("Purchase deleted!");
        queryClient.invalidateQueries({
           queryKey: ["purchases"],
        });
  } else {

  }
};


  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Total (৳)", accessor: "grandTotal" },
    { header: "Products (৳)", accessor: "productTotal" },
    { header: "Transport (৳)", accessor: "transportCost" },
    { header: "Other (৳)", accessor: "otherCost" },
    { header: "Memos", accessor: "memos" },
    { header: "Note", accessor: "note" },
    { header: "Action", accessor: "action" },
  ];

  const data = purchases.map((item: Purchase) => {
    return {
      date: item.date
        ? new Date(item.date).toLocaleDateString()
        : "-",

      grandTotal: item.grandTotal?.toLocaleString() || "0",
      productTotal: item.productTotal?.toLocaleString() || "0",
      transportCost: item.transportCost?.toLocaleString() || "0",
      otherCost: item.otherCost?.toLocaleString() || "0",

      memos: item.memos?.length
        ? `${item.memos.length} memo`
        : "0",

      note: item.note || "-",

      // 👉 Action buttons
      action: (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            onClick={() => {
              setSwlctEditData(item);
              setOpen(true);
            }}
          >
            Edit
          </button>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            onClick={() => handleDelete(item._id?.toString() || "")}
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        🧾 Purchases
      </h2>

      <CustomTable columns={columns} data={data} />
      <CustomModal open={open} onOpenChange={setOpen} >
        <EditPurchase isOpen={open} onClose={() => setOpen(false)} initialData={swlctEditData || null} />
      </CustomModal>
      {ConfirmModal}
    </div>
  );
};

export default PurchaseDataTable;