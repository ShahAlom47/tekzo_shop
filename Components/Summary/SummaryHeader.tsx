interface SummaryHeaderProps {
  year: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  children?: React.ReactNode;
}

const SummaryHeader = ({
  year,
  currentYear,
  onYearChange,
  children,
}: SummaryHeaderProps) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Summary
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of sales, profit, expenses and cash flow for{" "}
            <span className="font-semibold text-blue-600">{year}</span>.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="summary-year"
              className="text-sm font-medium text-gray-600"
            >
              Year
            </label>

            <select
              id="summary-year"
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default SummaryHeader;