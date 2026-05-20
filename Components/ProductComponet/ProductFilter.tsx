"use client";

import { useState } from "react";
import {
  GetAllProductParams,
  SortOptions,
} from "@/Interfaces/productInterface";
import { useCategories } from "@/hook/useCategory";
import CategorySelect from "../Categories/CategorySelect";

interface Props {
  onFilterChange: (filters: Partial<GetAllProductParams>) => void;
}

export default function ProductFilter({ onFilterChange }: Props) {

    const {categories}=useCategories();
  const [filters, setFilters] =
    useState<Partial<GetAllProductParams>>({
      searchTrim: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: undefined,
      stock: undefined,
    });

  const handleChange = (
    field: keyof GetAllProductParams,
    value: string
  ) => {
    const updated: Partial<GetAllProductParams> = {
      ...filters,
      [field]: value || undefined, // empty হলে undefined
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetData: Partial<GetAllProductParams> = {};
    setFilters(resetData);
    onFilterChange(resetData);
  };

  return (
   <div className="bg-white/80 backdrop-blur-md border border-gray-200 
rounded-2xl p-5 shadow-sm mb-6">

  <div className="flex flex-col gap-4">

    {/* Top Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.searchTrim || ""}
          onChange={(e) =>
            handleChange("searchTrim", e.target.value)
          }
          className="w-full border border-gray-200 
          focus:border-black focus:ring-1 focus:ring-black
          px-4 py-2.5 rounded-xl text-sm 
          transition-all duration-200 outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <CategorySelect
          value={filters.category || ""}
          onChange={(value) =>
            handleChange("category", value || "")
          }
          allowNone={true}
        />
      </div>

      {/* Stock */}
      <select
        value={filters.stock || ""}
        onChange={(e) =>
          handleChange("stock", e.target.value)
        }
        className="w-full border border-gray-200
        focus:border-black focus:ring-1 focus:ring-black
        px-4 py-2.5 rounded-xl text-sm
        outline-none transition-all duration-200"
      >
        <option value="">All Stock</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      {/* Sort */}
      <select
        value={filters.sort || ""}
        onChange={(e) =>
          handleChange(
            "sort",
            e.target.value as SortOptions
          )
        }
        className="w-full border border-gray-200
        focus:border-black focus:ring-1 focus:ring-black
        px-4 py-2.5 rounded-xl text-sm
        outline-none transition-all duration-200"
      >
        <option value="">Sort</option>
        <option value="asc">Price Low → High</option>
        <option value="desc">Price High → Low</option>
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
      </select>
    </div>

    {/* Bottom Row */}
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">

      <p className="text-xs text-gray-500">
        Filter and manage your products efficiently
      </p>

      <button
        onClick={handleReset}
        className="px-4 py-2 text-sm font-medium
        border border-gray-300 rounded-xl
        hover:bg-black hover:text-white
        transition-all duration-200"
      >
        Reset Filters
      </button>
    </div>

  </div>
</div>
  );
}