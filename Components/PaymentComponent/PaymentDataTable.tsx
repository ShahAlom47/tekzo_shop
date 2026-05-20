import { CustomTable } from "../CommonComponents/CustomTable";
import { Payment } from "@/Interfaces/paymentInterface";

interface PropsType {
  payments: Payment[];
}

const PaymentDataTable = ({ payments }: PropsType) => {
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Amount (৳)", accessor: "amount" },
    { header: "Method", accessor: "method" },
    { header: "Type", accessor: "type" },
    { header: "Note", accessor: "note" },
  ];

  // ✅ map and format data
  const data = payments.map((item: Payment) => {
    return {
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleString() // format date
        : "-",
      amount: item.amount?.toLocaleString() || "0", // formatted number
      method: item.method || "-",
      type: item.type || "-",
      note: item.note || "-",
    };
  });

  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        💰 Payments
      </h2>
      <CustomTable columns={columns} data={data} />
    </div>
  );
};

export default PaymentDataTable;