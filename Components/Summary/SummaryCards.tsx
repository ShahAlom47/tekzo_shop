import SummaryCard from "./SummaryCard";

interface SummaryCardsProps {
  overall: {
    totalSales: number;
    totalProfit: number;
    expense: number;
    actualProfit: number;
    collection: number;
    due: number;
    stockBuy: number;
    totalQuantity: number;
    remainingAmount: number;
  } | null;
}

const SummaryCards = ({ overall }: SummaryCardsProps) => {
  if (!overall) return null;

  const cards = [
    {
      title: "Sales",
      value: overall.totalSales,
      color: "blue",
    },
    {
      title: "Profit",
      value: overall.totalProfit,
      color: overall.totalProfit >= 0 ? "green" : "red",
    },
    {
      title: "Expense",
      value: overall.expense,
      color: "orange",
    },
    {
      title: "Actual Profit",
      value: overall.actualProfit,
      color: overall.actualProfit >= 0 ? "green" : "red",
    },
    {
      title: "Collection",
      value: overall.collection,
      color: "emerald",
    },
    {
      title: "Due",
      value: overall.due,
      color: overall.due > 0 ? "red" : "green",
    },
    {
      title: "Purchase",
      value: overall.stockBuy,
      color: "purple",
    },
    {
      title: "Quantity",
      value: overall.totalQuantity,
      color: "cyan",
    },
    {
      title: "Remaining Cash",
      value: overall.remainingAmount,
      color: overall.remainingAmount >= 0 ? "green" : "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          color={card.color}
        />
      ))}
    </div>
  );
};

export default SummaryCards;