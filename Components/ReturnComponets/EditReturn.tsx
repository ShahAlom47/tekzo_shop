import { Return } from "@/interfaces/returnInterface";
import React from "react";

type Props = {
  returnData: Return | null;
  setEditData: React.Dispatch<React.SetStateAction<Return | null>>;
    setOpenEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditReturn = ({ returnData, setEditData, setOpenEditModal }: Props) => {
  if (!returnData) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Return Details
          </h2>

          <p className="text-sm text-amber-600 mt-1">
            ⚠️ Note: This page is temporarily being used as a View page.
            Edit functionality will be added later.
          </p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpenEditModal?.(false);
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Close
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Sale Number</p>
          <p className="font-semibold">
            {returnData.saleNumber || "N/A"}
          </p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Created At</p>
          <p className="font-semibold">
            {returnData.createdAt
              ? new Date(returnData.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="font-semibold text-lg mb-3">
          Returned Products
        </h3>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Sell Price</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Profit</th>
              </tr>
            </thead>

            <tbody>
              {returnData.products.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {item.productName || "Unknown Product"}
                  </td>

                  <td className="p-3 text-center">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-right">
                    {item.sellingPrice} TK
                  </td>

                  <td className="p-3 text-right">
                    {item.costPrice} TK
                  </td>

                  <td className="p-3 text-right font-medium">
                    {item.totalPrice} TK
                  </td>

                  <td className="p-3 text-right text-green-600">
                    {item.profit} TK
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Total Qty</p>
          <p className="font-bold">{returnData.totalQuantity}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold text-red-500">
            {returnData.totalAmount} TK
          </p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="font-bold">
            {returnData.totalCost} TK
          </p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Total Profit</p>
          <p className="font-bold text-green-600">
            {returnData.totalProfit} TK
          </p>
        </div>
      </div>

      {/* Note */}
      <div>
        <h3 className="font-semibold mb-2">Note</h3>

        <div className="border rounded-lg p-3 min-h-[100px] bg-gray-50">
          {returnData.note || "No note added."}
        </div>
      </div>
    </div>
  );
};

export default EditReturn;