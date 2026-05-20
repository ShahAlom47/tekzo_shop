"use client";

import Link from "next/link";
import { CustomTable } from "../CommonComponents/CustomTable";
import { Product } from "@/Interfaces/productInterface";
import { useCategories } from "@/hook/useCategory";
import DeleteProductButton from "./DeleteProductButton";

interface Props {
  products: Product[];
}

const ProductTableView = ({ products }: Props) => {
  const { categories } = useCategories();

const catName = (catId: string) => {
  const category = categories.find((cat) => cat._id === catId);
  return category ? category.name : "N/A";
}

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Product Code", accessor: "productCode" },
    { header: "Category", accessor: "category" },
    { header: "Stock", accessor: "currentStock" },
    { header: "Selling Price", accessor: "sellingPrice" },
    { header: "Cost Price", accessor: "costPrice" },
    { header: "Stock Value", accessor: "stockValue" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const data = products.map((item) => {
    const stockValue = item.currentStock * item.costPrice;

    return {
      name: item.name,

      productCode: item.productCode || "N/A",

      category: catName(item.categoryId),

      currentStock: (
        <span
          className={
            item.currentStock === 0
              ? "text-red-500 font-semibold"
              : item.currentStock < 5
              ? "text-yellow-600 font-medium"
              : ""
          }
        >
          {item.currentStock} {item.unit}
        </span>
      ),

      sellingPrice: `${item.sellingPrice} TK`,

      costPrice: `${item.costPrice} TK`,

      stockValue: `${stockValue} TK`,

      status: (
        <span
          className={
            item.status === "ACTIVE"
              ? "text-green-600 font-medium"
              : "text-gray-400"
          }
        >
          {item.status}
        </span>
      ),

      action: (
        <div className="flex gap-3">
          <Link
            href={`/dashboard/products/${item._id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>

        <DeleteProductButton productId={item._id.toString()}></DeleteProductButton>
        </div>
      ),
    };
  });

  return <CustomTable columns={columns} data={data} />;
};

export default ProductTableView;