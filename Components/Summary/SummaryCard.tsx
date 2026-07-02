interface Props {
  title: string;
  value: number | string;
  color?: string;
}

const colors = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "text-blue-700",
    value: "text-blue-800",
  },

  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    title: "text-green-700",
    value: "text-green-800",
  },

  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    title: "text-red-700",
    value: "text-red-800",
  },

  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    title: "text-orange-700",
    value: "text-orange-800",
  },

  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    title: "text-purple-700",
    value: "text-purple-800",
  },

  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    title: "text-cyan-700",
    value: "text-cyan-800",
  },

  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "text-emerald-700",
    value: "text-emerald-800",
  },
};

const SummaryCard = ({
  title,
  value,
  color = "blue",
}: Props) => {
  const theme =
    colors[color as keyof typeof colors] ?? colors.blue;

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${theme.bg} ${theme.border}`}
    >
      <p className={`text-sm font-medium ${theme.title}`}>
        {title}
      </p>

      <h2 className={`mt-2 text-2xl font-bold ${theme.value}`}>
        {Number(value || 0).toLocaleString()} Tk
      </h2>
    </div>
  );
};

export default SummaryCard;