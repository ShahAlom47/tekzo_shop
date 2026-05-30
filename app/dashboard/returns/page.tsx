"use client";

import ReturnForm from "@/Components/ReturnComponets/ReturnForm";
import ReturnTable from "@/Components/ReturnComponets/ReturnTable";
import React, { useState } from "react";

const ReturnPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Return Management</h1>
      </div>

      {/* FORM */}
      <ReturnForm onSuccess={() => setRefresh(!refresh)} />

      {/* TABLE */}
      <ReturnTable refresh={refresh} />
    </div>
  );
};

export default ReturnPage;