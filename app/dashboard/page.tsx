"use client";

import Link from "next/link";



const OverviewPage = () => {





  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <Link href="/dashboard/summary">View Summary</Link>
      <Link href="/dashboard/sales/addSale">Add Sale</Link>


    </div>
  );
};

export default OverviewPage;