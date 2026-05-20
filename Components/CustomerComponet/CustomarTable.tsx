'use client'

import { Customer } from "@/Interfaces/customerInterface";
import { CustomTable } from "../CommonComponents/CustomTable";
import DeleteCustomerButton from "./DeleteCustomerButton";
import CustomModal from "../CommonComponents/CustomModal";
import EditCustomer from "./EditCustomer";
import { useState } from "react";
import Link from "next/link";

interface TableProps {
    customer:Customer[];
    refetch?:()=>void;
}

const CustomerTable = ({ customer, refetch }:TableProps) => {

  const [selectedCustomer,setCustomer] = useState<Customer|null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
 

  const handleEdit = (customer:Customer) => {
    setCustomer(customer);
    setIsOpen(true);

  }


 const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "Current Due", accessor: "currentStock" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const data = customer.map((customer) => ({
    name: (<h1 className="font-medium">{customer.name}</h1>),
    phone: customer.phone,
    address: customer.address,
    currentStock: customer.currentDue,
    status: (<span className={`px-2 py-1 rounded-full text-sm ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {customer.isActive ? 'Active' : 'Inactive'}
    </span>),
    action: (
      <div className="flex gap-2">  
       
        <Link href={`/dashboard/customers/${customer?._id.toString()}`} className="bg-blue-600 text-white px-3 py-1 rounded-lg">
          View
        </Link>
        <button onClick={()=>handleEdit(customer)} className="bg-yellow-600 text-white px-3 py-1 rounded-lg">Edit</button>
        <DeleteCustomerButton id={customer?._id.toString()} refetch={refetch} ></DeleteCustomerButton>
      </div>
    ),      
  }));

    return (
        <div>
            <CustomTable columns={columns} data={data} />
            <CustomModal open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <EditCustomer customer={selectedCustomer||null} refetch={refetch || (() => {})} setIsOpen={setIsOpen} />
            </CustomModal>
        </div>
    );
};

export default CustomerTable;