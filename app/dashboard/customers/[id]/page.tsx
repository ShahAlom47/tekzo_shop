"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useCustomer } from "@/hook/useCustomer";
import { addPayment } from "@/lib/allApiRequest/paymentRequest/paymentRequest";
import toast, { Toaster } from "react-hot-toast";
import CustomerHeader from "@/Components/CustomerComponet/CustomerHeader";
import SummaryCards from "@/Components/CustomerComponet/SummaryCards";
import SalesSection from "@/Components/CustomerComponet/SalesSection";
import PaymentModal from "@/Components/CustomerComponet/PaymentModal";
import { PaymentMethod } from "@/Interfaces/paymentInterface";
import { PaymentFormData } from "@/Interfaces/saleInterfaces";
import PaymentHistoryTable from "@/Components/CustomerComponet/PaymentHistoryTable";

export default function CustomerDetails() {
  const { id } = useParams();
  const { data, isLoading } = useCustomer(id?.toString() || "");

  const [openPayment, setOpenPayment] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: "",
    method: "CASH",
    transactionId: "",
    paymentDate: "",
    note: "",
  });

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  const customer = data?.customer;
  const summary = data?.summary;
  const sales = data?.sales || [];
  const paymentHistory= Array.isArray(data?.paymentHistory) ? data?.paymentHistory : []



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    const res = await addPayment({
      customerId: id?.toString() || "",
      amount: Number(formData.amount),
      method: formData.method as PaymentMethod,
      note: formData.note,
      transactionId: formData.method !== "CASH" ? formData.transactionId ?? "" : "",
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate).toISOString()
        : new Date().toISOString(),
    });

    if (!res.success) return toast.error(res.message);

    toast.success("Payment Added");
    setOpenPayment(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Toaster />

      <CustomerHeader
        customer={customer}
        due={summary?.currentDue}
        onPay={() => setOpenPayment(true)}
      />

      <SummaryCards summary={summary} />

      <PaymentHistoryTable payments={paymentHistory} ></PaymentHistoryTable>

      <SalesSection sales={sales} />

      <PaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
