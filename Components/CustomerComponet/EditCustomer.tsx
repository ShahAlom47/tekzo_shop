"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AddCustomerFormInputs, Customer } from "@/Interfaces/customerInterface";
import { updateCustomer } from "@/lib/allApiRequest/customerRequest/customerRequest";
import toast, { Toaster } from "react-hot-toast";

interface EditCustomerProps {
  customer: Customer | null;
  onSuccess?: (customer: Customer) => void;
  refetch: () => void;
  setIsOpen: (open: boolean) => void;
}

const EditCustomer = ({ customer, onSuccess,refetch,setIsOpen }: EditCustomerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddCustomerFormInputs>();

  // 🔥 Existing customer data form এ বসানো
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        customerType: customer.customerType || "REGULAR",
        openingBalance: customer.openingBalance,
        creditLimit: customer.creditLimit,
        isActive: customer.isActive,
      });
    }
  }, [customer, reset]);

  const onSubmit: SubmitHandler<AddCustomerFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      if (!customer) {
        toast.error("Customer data not available");
        return;
      }

      const response = await updateCustomer(customer._id.toString(), data);

      if (!response.success) {
        toast.error(response.message || "Failed to update customer");
        setIsOpen(false)
        refetch();
        return;
      }

      const updatedCustomer = response?.data as Customer;

      toast.success("Customer updated successfully!");

      if (onSuccess) {
        onSuccess(updatedCustomer);
      }

    } catch (error) {
      console.error(error);
      toast.error("Error updating customer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Edit Customer</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            {...register("phone", { required: "Phone is required" })}
            className="w-full border p-2 rounded-lg"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            {...register("address", { required: "Address is required" })}
            className="w-full border p-2 rounded-lg"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Customer Type */}
        <div>
          <label className="block mb-1 font-medium">Customer Type</label>
          <select
            {...register("customerType")}
            className="w-full border p-2 rounded-lg"
          >
            <option value="REGULAR">Regular</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Opening Balance */}
        <div>
          <label className="block mb-1 font-medium">Opening Balance</label>
          <input
            {...register("openingBalance", { valueAsNumber: true })}
            type="number"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Credit Limit */}
        <div>
          <label className="block mb-1 font-medium">Credit Limit</label>
          <input
            {...register("creditLimit", { valueAsNumber: true })}
            type="number"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Active */}
        <div className="flex items-center space-x-2">
          <input {...register("isActive")} type="checkbox" />
          <label className="font-medium">Active</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Updating..." : "Update Customer"}
        </button>
      </form>

      <Toaster position="top-right" />
    </div>
  );
};

export default EditCustomer;