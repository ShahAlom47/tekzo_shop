"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { ObjectId } from "mongodb";
import { useQuery } from "@tanstack/react-query";

import { deleteCategory, getAllCategories } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import { useConfirm } from "@/hook/useConfirm";
import { Category } from "@/Interfaces/categoryInterfaces";
import PrimaryButton from "@/Components/CommonComponents/PrimaryButton";

import ErrorPage from "@/app/error";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import Loading from "@/app/loading";
import { CustomTable } from "@/Components/CommonComponents/CustomTable";
import CustomModal from "@/Components/CommonComponents/CustomModal";
import AddCategory from "@/Components/Categories/AddCategory";
import EditCategory from "@/Components/Categories/EditCategory";


const ManageCategory = () => {
  const { confirm, ConfirmModal } = useConfirm();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<"add" | "edit">("add");
  const [selectedCat, setSelectedCat] = useState<Category | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleModal = (content: "add" | "edit", data?: Category) => {
    setOpenModal(true);
    setModalContent(content);
    if (data) {
      setSelectedCat(data);
    }
  };

  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllCategories", page],
    queryFn: async () => {
      const response = await getAllCategories({
        currentPage: page,
        limit,
      });
      // if (!response || !response.success) {
      //   throw new Error(response.message || "Failed to fetch category data");
      // }
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id: string | ObjectId) => {
    const ok = await confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (ok) {
      const res = await deleteCategory(id);
      if (res?.success) {
        toast.success("Category deleted!");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete");
      }
    }
  };

  const columns = [
  
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: "slug" },
    { header: "Parent", accessor: "parentCategory" },
    { header: "Edit", accessor: "edit" },
    { header: "Delete", accessor: "delete" },
  ];

  const data =
    (category?.data as Category[] | undefined)?.map((cat) => {
     

      return {
       
        name: cat.name,
        slug: cat.slug,
        parentCategory: cat.parentCategoryId || "—",
        edit: (
          <button
            className="btn-bordered"
            onClick={() =>
              handleModal("edit", cat as Category)
            }
          >
            Edit
          </button>
        ),
        delete: (
          <button
            className="btn-bordered border-red-700 hover:bg-red-700"
            onClick={() =>
              handleDelete(typeof cat._id === "string" ?  cat._id?.toString():'')
            }
          >
            Delete
          </button>
        ),
      };
    }) || [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <PrimaryButton
          onClick={() => handleModal("add")}
          className="rounded-sm text-sm h-8"
        >
           Add Category
        </PrimaryButton>
      </div>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorPage />
      ) : (
        <>
          <CustomTable columns={columns} data={data} className="shadow-md" />
          <DashPaginationButton
            currentPage={page}
            totalPages={category?.totalPages || 1}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </>
      )}

      <CustomModal
        open={openModal}
        onOpenChange={setOpenModal}
        title={modalContent === "add" ? "Add Category" : "Edit Category"}
      >
        {modalContent === "add" ? (
          <AddCategory  setModalOpen={setOpenModal} />
        ) : (
          <EditCategory category={selectedCat || undefined} setOpenModal={setOpenModal} />
        )}
      </CustomModal>

      {ConfirmModal}
    </div>
  );
};

export default ManageCategory;
