/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SearchBox from "../CommonComponents/SearchBox";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  clearFilters: () => void;
}

const SaleFilter = ({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  clearFilters,
}: Props) => {
  return (
    <div className="bg-white shadow-sm border rounded-xl p-4 mb-5">
      <div className="grid md:grid-cols-6 gap-3 items-end">
        {/* Search */}
        <div className="md:col-span-3">
          <label className="text-sm text-gray-500 mb-1 block">Search</label>
          <SearchBox value={search} setValue={setSearch} />
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full  border border-blue-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">
            Payment Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Clear Button */}
      <div className="flex justify-end mt-3">
        <button
          onClick={clearFilters}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SaleFilter;
