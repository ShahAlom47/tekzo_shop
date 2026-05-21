"use client";

import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { Product, ProductFormData } from "@/interfaces/productInterface";
import { useCategories } from "@/hook/useCategory";
import Input from "../CommonComponents/Input";
import Select from "../CommonComponents/Select";
import SlugInput from "../CommonComponents/SlugInput";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  loading,
}: ProductFormProps) {
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      slug: "",
      productCode: "",
      brand: "",
      categoryId: "",
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      unit: "PCS",
      supplierId: "",
      status: "ACTIVE",
    },
  });

  // Edit mode data set
  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));
  }, [categories]);

  const unitOptions = [
    { value: "PCS", label: "PCS" },
    { value: "KG", label: "KG" },
    { value: "LITER", label: "LITER" },
    { value: "BOX", label: "BOX" },
    { value: "Feet", label: "Feet" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "INACTIVE", label: "INACTIVE" },
  ];

  // submit + reset
  const submitHandler = async (data: ProductFormData) => {
    await onSubmit(data);

    // add mode হলে reset হবে
    if (!product) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-white p-6 rounded-2xl shadow-md space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Product Name *"
          required
          {...register("name", { required: "Product name required" })}
          error={errors.name?.message}
        />

        <SlugInput
          label="Slug *"
          nameField="name"
          slugField="slug"
          register={register}
          watch={watch}
          setValue={setValue}
          error={errors.slug?.message}
        />

        <Input label="Product Code" {...register("productCode")} />

        <Select
          label="Category *"
          required
          {...register("categoryId", { required: "Select category" })}
          options={categoryOptions}
          error={errors.categoryId?.message}
        />

        <Input label="Brand" {...register("brand")} />

        <Input
          label="Cost Price *"
          type="number"
          required
          {...register("costPrice", { required: true, min: 0 })}
        />

        <Input
          label="Selling Price *"
          type="number"
          required
          {...register("sellingPrice", { required: true, min: 0 })}
        />

        <Input
          label="Current Stock *"
          type="number"
          required
          {...register("currentStock", { required: true, min: 0 })}
        />

        <Select
          label="Unit *"
          required
          {...register("unit")}
          options={unitOptions}
        />

        <Select
          label="Status"
          required
          {...register("status")}
          options={statusOptions}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="reset"
          onClick={() => reset()}
          disabled={loading}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : product
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}