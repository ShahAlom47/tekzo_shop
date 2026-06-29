"use client";

import { deleteReturn, getAllReturn } from "@/lib/allApiRequest/returnRequest/returnRequest";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { DashPaginationButton } from "../CommonComponents/DashPaginationButton";
import { Return } from "@/interfaces/returnInterface";
import { CustomTable } from "../CommonComponents/CustomTable";
import { useConfirm } from "@/hook/useConfirm";
import toast from "react-hot-toast";
import CustomModal from "../CommonComponents/CustomModal";
import EditReturn from "./EditReturn";

type Props = {
  refresh: boolean;
};

const ReturnTable = ({ refresh }: Props) => {
  const [page, setPage] = useState(1);
  const limit = 30;

    const [loading, setLoading] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();
  const [editeData, setEditData] = useState<Return | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["returns", page, refresh],
    queryFn: async () => {
      return await getAllReturn({
        currentPage: page,
        limit,
      });
    },
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading...</p>;

  const returnData = (data?.data as Return[]) || [];
  const totalPages = data?.totalPages || 1;

  const handelDelete = async (id: string | undefined) => {
  
     const ok = await confirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (!ok) return;
      if (!id) return;

    try {
      setLoading(true);

      const res = await deleteReturn(id);

      if (res?.success) {
        toast.success("Product deleted!");

        // ✅ Invalidate products query
        queryClient.invalidateQueries({
          queryKey: ["returns"],
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
}


const columns = [
  { header: "Sale No", accessor: "saleNumber" },
  { header: "Products", accessor: "products" },
  { header: "Qty", accessor: "totalQuantity" },
  { header: "Amount", accessor: "totalAmount" },
  { header: "Profit", accessor: "totalProfit" },
  { header: "Note", accessor: "note" },
  { header: "Date", accessor: "createdAt" },
  { header: "Action", accessor: "action" },
];
const tableData = returnData.map((item) => ({
  saleNumber: item.saleNumber || "N/A",

  products: (
    <div className="flex flex-col">
      {item.products.map((product, index) => (
        <span key={index}>
          {product.productName} ({product.quantity})
        </span>
      ))}
    </div>
  ),

  totalQuantity: <span className="font-medium">{item.totalQuantity}</span>,

  totalAmount: (
    <span className="text-red-600 font-medium">
      {item.totalAmount} TK
    </span>
  ),

  totalProfit: (
    <span
      className={
        item.totalProfit >= 0
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {item.totalProfit} TK
    </span>
  ),

  note: item.note || "-",

  createdAt: item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB")
    : "N/A",

  action: (
    <div className="flex gap-3">
      
      <button
        className="text-blue-600 hover:underline"
        onClick={() => {
          setEditData(item);
          setOpenEditModal(true);
        }}  
      >
        Edit
      </button>

      {/* Delete Button */}
     <button className="text-red-600 hover:underline cursor-pointer" onClick={() => handelDelete(item?._id?.toString())}>
        Delete
        </button>
      </div>
  ),
}));


  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-bold mb-3">Return History</h2>

      <CustomTable columns={columns} data={tableData} />

      <DashPaginationButton
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        className="mt-4"
      />
      <CustomModal open={openEditModal} onOpenChange={() => setOpenEditModal(false)}>
     <EditReturn returnData={editeData} setEditData={setEditData} setOpenEditModal={setOpenEditModal} />
      </CustomModal>
      {ConfirmModal}
    </div>
  );
};

export default ReturnTable;