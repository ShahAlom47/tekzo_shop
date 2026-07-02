"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SummaryCards from "./SummaryCards";

const AllTimeSummary = () => {
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["summary-all"],
    queryFn: async () => {
      const res = await fetch("/api/summary/all");

      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }

      return res.json();
    },
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const overall = data?.data?.overall ?? null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {open ? "Hide All Time Summary" : "Show All Time Summary"}
        </button>

        {open && (
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {open && (
        <div className="rounded-lg border p-5">
          {isLoading && <p>Loading...</p>}

          {error && (
            <p className="text-red-500">
              {(error as Error).message}
            </p>
          )}

          {!isLoading && !error && (
            <SummaryCards overall={overall} />
          )}
        </div>
      )}
    </div>
  );
};

export default AllTimeSummary;