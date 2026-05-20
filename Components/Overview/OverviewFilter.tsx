"use client";

import { OverviewFilter } from "@/Interfaces/overviewInterface";

interface Props {
  filter: OverviewFilter;
  onChange: (filter: OverviewFilter) => void;
}

const OverviewFilterComponent = ({ filter, onChange }: Props) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4 items-center">

      {/* Today Button */}
      <button
        onClick={() => onChange({ type: "today" })}
        className={`px-3 py-1 rounded transition ${
          filter.type === "today"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Today
      </button>

      {/* Custom Month */}
      <button
        onClick={() =>
          onChange({
            type: "custom",
            month: filter.type === "custom" ? filter.month : "",
          })
        }
        className={`px-3 py-1 rounded transition ${
          filter.type === "custom"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Custom
      </button>

      {/* Month Picker */}
      {filter.type === "custom" && (
        <input
          type="month"
          value={filter.month}
          onChange={(e) => onChange({ ...filter, month: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      )}
    </div>
  );
};

export default OverviewFilterComponent;