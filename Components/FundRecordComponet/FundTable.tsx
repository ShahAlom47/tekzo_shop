"use client";

import { CustomTable } from "../CommonComponents/CustomTable";
import { FundRecord } from "@/Interfaces/fundRecordInterface";
import { useState } from "react";
import CustomModal from "../CommonComponents/CustomModal";
import FundForm from "./FundForm";
import { useConfirm } from "@/hook/useConfirm";
import {
  deleteFundRecord,
  updateFundRecord,
} from "@/lib/allApiRequest/fundRecordRequest/fundRecordRequest";
import toast from "react-hot-toast/headless";
import { useQueryClient } from "@tanstack/react-query";

interface PropsType {
  fundRecords: FundRecord[];
}

const FundTable = ({ fundRecords }: PropsType) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<FundRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();

  // ✅ Edit
  const handleEdit = (record: FundRecord) => {
   
    setSelectedRecord(record);
    setOpenModal(true);
  };

  // ✅ Update
  const handleSubmit = async (data: FundRecord) => {
   
      const id = selectedRecord?._id;

      if (!selectedRecord?._id) {
        toast.error("ID is missing!");
        return;
      }

      setLoading(true);

      const res = await updateFundRecord(selectedRecord?._id.toString(), data);
   

      if (res?.success) {
        toast.success("Updated successfully 🎉");

        await queryClient.invalidateQueries({
          queryKey: ["fundRecords"],
        });

        setOpenModal(false);
        setSelectedRecord(null);
        return;
      } else {
        toast.error("Update failed ❌");
      }
 
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete",
      message: "Are you sure?",
      confirmText: "Yes",
      cancelText: "Cancel",
    });

    if (ok) {
      const res = await deleteFundRecord(id);

      if (res.success) {
        toast.success("Deleted ✅");
        setLoading(false)
        queryClient.invalidateQueries({
          queryKey: ["fundRecords"],
        });
      } else {
        toast.error("Delete failed ❌");
        setLoading(false)
      }
    }
  };

  // ✅ Columns
  const columns = [
    { header: "Source", accessor: "source" },
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Category", accessor: "category" },
    { header: "Date", accessor: "date" },
    { header: "Note", accessor: "note" },
    { header: "Action", accessor: "action" },
  ];

  // ✅ Data
  const data = fundRecords.map((item) => ({
    source: item.source,
    type: (
      <span
        className={`px-2 py-1 text-white rounded ${
          item.type === "IN" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {item.type}
      </span>
    ),
    amount: `৳ ${item.amount}`,
    category: item.category,
    date: new Date(item.date).toLocaleDateString(),
    note: item.note || "-",
    action: (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleEdit(item)}
          className="bg-yellow-400 px-2 py-1 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={() => item._id && handleDelete(item._id.toString())}
          className="bg-red-500 px-2 py-1 text-white rounded"
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">💰 Fund Records</h2>

      <CustomTable columns={columns} data={data} />

      {/* Modal */}
      <CustomModal open={openModal} onOpenChange={setOpenModal}>
        <FundForm
          initialData={selectedRecord || undefined}
          onSubmit={handleSubmit}
          onClose={() => setOpenModal(false)}
          loading={loading}
        />
      </CustomModal>

      {ConfirmModal}
    </div>
  );
};

export default FundTable;