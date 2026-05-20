"use client";

import { useCategories } from "@/hook/useCategory";
import { Product } from "@/Interfaces/productInterface";
import Link from "next/link";

interface Props {
  products: Product[];
}

const ProductCardView = ({ products }: Props) => {
  const { categories } = useCategories();

  const catName = (catId: string) => {
    const category = categories.find((cat) => cat._id === catId);
    return category ? category.name : "N/A";
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {products.map((item) => {
        const stockValue = item.currentStock * item.costPrice;
        const isOutOfStock = item.currentStock === 0;
        const isLowStock =
          item.currentStock > 0 && item.currentStock < 5;

        return (
          <div
            key={item._id.toString()}
            className="bg-white border border-gray-200 
            rounded-2xl p-5 shadow-sm 
            hover:shadow-lg transition-all duration-300 
            flex flex-col justify-between"
          >
            {/* Top Section */}
            <div className="space-y-3">

              {/* Header */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {catName(item.categoryId)}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full
                    ${
                      item.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Product Code */}
              <p className="text-xs text-gray-400">
                Code: {item.productCode || "N/A"}
              </p>

              {/* Pricing */}
              <div className="flex justify-between items-center pt-2">
                  <span className="text-lg  text-gray-900">
                 Cost: ৳ {item.costPrice}
                </span>
                <span className="text-lg  text-gray-900">
                Sell:  ৳ {item.sellingPrice}
                </span>
              

                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full
                    ${
                      isOutOfStock
                        ? "bg-red-100 text-red-600"
                        : isLowStock
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : isLowStock
                    ? "Low Stock"
                    : "In Stock"} • {item.currentStock} {item.unit}
                </span>
              </div>

              {/* Stock Value */}
              <p className="text-xs text-gray-500">
                Stock Value: ৳ {stockValue}
              </p>
            </div>

            {/* Action Button */}
            <Link
              href={`/dashboard/products/${item._id}`}
              className="mt-4 block text-center 
              text-sm font-medium 
              border-black  border
              py-1 rounded-sm 
              hover:opacity-90 transition"
            >
              View & Edit
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCardView;