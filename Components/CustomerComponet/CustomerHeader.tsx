import { Phone, Mail, MapPin } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomerHeader({ customer, due, onPay }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex justify-between">
      <div>
        <h1 className="text-2xl font-bold">{customer?.name}</h1>
        <div className="text-sm text-gray-500 mt-2 space-y-1">
          <p className="flex gap-2"><Phone size={14}/> {customer?.phone}</p>
          <p className="flex gap-2"><Mail size={14}/> {customer?.email}</p>
          <p className="flex gap-2"><MapPin size={14}/> {customer?.address}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-400">Current Due</p>
        <p className="text-3xl font-bold text-red-500">৳ {due || 0}</p>

        <button
          onClick={onPay}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          Pay Due
        </button>
      </div>
    </div>
  );
}