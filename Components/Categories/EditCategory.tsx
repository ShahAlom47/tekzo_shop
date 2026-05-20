"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import CategoryForm from "./CategoryForm";
import { updateCategory } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import { Category } from "@/Interfaces/categoryInterfaces";

interface EditCategoryProps {
  category: Category | undefined;
  setOpenModal?: (open: boolean) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ category, setOpenModal }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleUpdate = async (data: Category) => {
    setLoading(true);
    try {
      const { _id, ...updateData } = data;
      const id = _id?.toString() || "";

      const res = await updateCategory(id, updateData);

      if (res?.success) {
        toast.success("Category updated successfully");

        queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });

        if (setOpenModal) setOpenModal(false);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryForm
      defaultValues={category}
      onSubmit={handleUpdate}
      submitText="Update Category"
      loading={loading}
    />
  );
};

export default EditCategory;