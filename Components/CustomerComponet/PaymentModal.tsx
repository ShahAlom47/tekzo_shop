
import { PaymentFormData } from "@/Interfaces/saleInterfaces";


type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  formData: PaymentFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function PaymentModal({
  open,
  onClose,
  formData,
  handleChange,
  handleSubmit,
}: PaymentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-2xl w-full max-w-md space-y-3"
      >
        <h2 className="font-semibold">Add Payment</h2>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border p-2 rounded"
        />

        {/* Method */}
        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="BANK">Bank</option>
          <option value="BKASH">Bkash</option>
        </select>

        {/* Transaction ID */}
        {formData.method !== "CASH" && (
          <input
            name="transactionId"
            value={formData.transactionId || ""}
            onChange={handleChange}
            placeholder="Transaction ID"
            className="w-full border p-2 rounded"
          />
        )}

        {/* Date */}
        <input
          type="date"
          name="paymentDate"
          value={formData.paymentDate || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Note */}
        <input
          name="note"
          value={formData.note || ""}
          onChange={handleChange}
          placeholder="Note"
          className="w-full border p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}