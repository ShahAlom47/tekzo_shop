"use client";

import { Customer } from "@/interfaces/customerInterface";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import CustomModal from "./CustomModal";
import AddCustomer from "./AddCustomer";

interface Props {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
}

const CustomerSelect = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
}: Props) => {
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter((customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <Combobox value={selectedCustomer} onChange={setSelectedCustomer}>
        <div className="relative">

          {/* Input */}
          <Combobox.Input
            className="w-full border rounded-lg px-3 py-2 outline-none"
            displayValue={(customer: Customer) => customer?.name || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select Customer"
          />

          {/* Options */}
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
            {filteredCustomers.length === 0 && query !== "" ? (
              <div className="p-3 text-sm text-gray-500">
                No customer found
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <Combobox.Option
                  key={customer._id.toString()}
                  value={customer}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 ${
                      active ? "bg-blue-500 text-white" : ""
                    }`
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-xs">{customer.phone}</span>
                  </div>
                </Combobox.Option>
              ))
            )}

            {/* Add Customer Button */}
            <div
              onClick={() => setOpenModal(true)}
              className="cursor-pointer border-t px-3 py-2 text-blue-600 hover:bg-gray-100"
            >
              + Add New Customer
            </div>
          </Combobox.Options>
        </div>
      </Combobox>

      {/* Add Customer Modal */}
      <CustomModal open={openModal} onOpenChange={setOpenModal}>
        <AddCustomer
          onSuccess={(customer: Customer) => {
            setSelectedCustomer(customer); // full object set
            setOpenModal(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default CustomerSelect;