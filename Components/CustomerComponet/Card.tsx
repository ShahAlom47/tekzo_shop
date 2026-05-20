// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Card({ title, value, danger }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-lg font-semibold ${danger ? "text-red-500" : "text-indigo-600"}`}>
        ৳ {value || 0}
      </p>
    </div>
  );
}