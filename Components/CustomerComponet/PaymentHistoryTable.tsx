"use client";

import { CustomerPaymentHistory } from "@/Interfaces/customerInterface";
import { CustomTable } from "../CommonComponents/CustomTable";

type Props = {
  payments: CustomerPaymentHistory[];
};

export default function PaymentHistoryTable({ payments }: Props) {

  const columns = [
    { header: "Date", accessor: "paymentDate" },
    { header: "Amount", accessor: "amount" },
    { header: "Method", accessor: "method" },
    { header: "Type", accessor: "type" },
    { header: "Transaction", accessor: "transactionId" },
    { header: "Note", accessor: "note" },
  ];

  const data = payments.map((payment) => {
    return {
      paymentDate: new Date(payment.paymentDate).toLocaleDateString(),

      amount: `৳ ${payment.amount}`,

      method: payment.method,

      type:
        payment.type === "DUE_PAYMENT" ? (
          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
            Due
          </span>
        ) : (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
            Sale
          </span>
        ),

      transactionId: payment.transactionId || "-",

      note: payment.note || "-",

      action: (
        <div className="flex gap-3">
          {/* future actions */}
        </div>
      ),
    };
  });

  return (
    <div>
            <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-3">Payment History</h2>
      <CustomTable
        columns={columns}
        data={data}
        className="border border-blue-900 rounded-sm p-4"
      />
    </div>
    </div>
  );
}