import Card from "./Card";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SummaryCards({ summary }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Sales" value={summary?.totalSalesAmount} />
      <Card title="Paid" value={summary?.totalPaid} />
      <Card title="Due" value={summary?.currentDue} danger />
      <Card title="Opening" value={summary?.openingBalance} />
    </div>
  );
}