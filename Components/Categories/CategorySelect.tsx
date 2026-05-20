"use client";

import { useCategories } from "@/hook/useCategory";
import Category from "@/interfaces/categoryInterfaces";
import { useMemo } from "react";

interface Props {
  value?: string | null;
  onChange?: (value: string | null) => void;
  excludeId?: string; // edit mode এ নিজেরটা বাদ দিতে
  allowNone?: boolean; // filter page এ দরকার
  className?: string;
}

const CategorySelect: React.FC<Props> = ({
  value,
  onChange,
  excludeId,
  allowNone = true,
  className = "",
}) => {
  const { categories, isLoading } = useCategories();

  const filteredCategories = useMemo(() => {
    if (!excludeId) return categories;
    return categories.filter((cat) => cat._id !== excludeId);
  }, [categories, excludeId]);

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange?.(e.target.value ? e.target.value : null)
      }
      className={`my-input w-full ${className}`}
    >
      {allowNone && <option value="" className="text-xs">Select Category</option>}

      {filteredCategories.map((cat: Category) => (
        <option key={cat._id?.toString()} value={cat._id?.toString()}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;