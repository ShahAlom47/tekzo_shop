"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCategories } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import Category from "@/interfaces/categoryInterfaces";

export const CATEGORY_QUERY_KEY = ["categories"];

export const useCategories = (categoryId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<Category[]>({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: async () => {
      const res = await getAllCategories({
        currentPage: 1,
        limit: 1000,
        searchTrim: "",
      });

      if (!res?.success) throw new Error("Failed to fetch categories");
      return res.data as Category[]; // 🔥 important
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const singleCategory = useMemo(() => {
    if (!categoryId || !query.data) return null;
    return query.data.find((cat) => cat._id === categoryId) || null;
  }, [categoryId, query.data]);

  const refetchCategories = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
  };

  return {
    categories: query.data ?? [],
    category: singleCategory,
    isLoading: query.isLoading,
    isError: query.isError,
    refetchCategories,
  };
};