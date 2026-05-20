"use client";

import React, { useState } from "react";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import { FundRecord } from "@/Interfaces/fundRecordInterface";
import FundForm from "@/Components/FundRecordComponet/FundForm";
import {
  addFundRecord,
  getAllFundRecords,
} from "@/lib/allApiRequest/fundRecordRequest/fundRecordRequest";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FundTable from "@/Components/FundRecordComponet/FundTable";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";

const FundRecordPage = () => {
  const [openModal, setModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FundRecord | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  // ✅ FIXED QUERY
  const { data } = useQuery({
    queryKey: ["fundRecords", page], // 🔥 important
    queryFn: async () => {
      const res = await getAllFundRecords({
        currentPage: page,
        limit,
      });
      return res;
    },
  });

  const fundRecords = data?.data as FundRecord[];
  const totalPages = data?.totalPages || 1;

  const handleAdd = () => {
    setEditingRecord(null);
    setModal(true);
  };

  // ✅ CLEAN SUBMIT
  const handleSubmit = async (formData: FundRecord) => {
    try {
      const res = await addFundRecord(formData);

      if (res?.success) {
        toast.success("Fund record saved successfully 🎉");

        setModal(false);

        // 🔥 correct refetch
        queryClient.invalidateQueries({
          queryKey: ["fundRecords"],
        });
      } else {
        toast.error("Failed ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error ❌");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fund Records</h1>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Fund
        </button>
      </div>

      <FundTable fundRecords={fundRecords || []} />

      <DashPaginationButton
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CustomModal open={openModal} onOpenChange={setModal}>
        <FundForm
          initialData={editingRecord || undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(false)}
        />
      </CustomModal>
    </div>
  );
};

export default FundRecordPage;