import CustomerSaleHistoryTable from "@/Components/CustomerComponet/CustomerSaleHistoryTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SalesSection({ sales }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-3">Sales History</h2>
      <CustomerSaleHistoryTable saleData={sales} />
    </div>
  );
}