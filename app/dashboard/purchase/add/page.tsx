'use client'

import PurchaseForm from "@/Components/Purchase/PurchaseForm";
import { Purchase } from "@/Interfaces/purchaseInterface";
import { addPurchase } from "@/lib/allApiRequest/purchaseRequest/purchaseRequest";
import toast from "react-hot-toast";

 const AddPurchase = () => {
  const handleAdd =async (data: Purchase)  => {

    const res= await addPurchase(data);
    if(!res?.success){
      toast.error( res?.message||"Failed to add purchase: "  );
    }   
    else{
      toast.success("Purchase added successfully");
    }
  };

  return <PurchaseForm onSubmit={handleAdd} />;
};

export default AddPurchase;

