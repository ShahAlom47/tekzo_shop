'use client'

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import ProductTableView from "@/Components/ProductComponet/ProductTableView ";
import { GetAllProductParams, Product } from "@/Interfaces/productInterface";
import ProductCardView from "@/Components/ProductComponet/ProductCardView";
import { DashPaginationButton } from "@/Components/CommonComponents/DashPaginationButton";
import ProductFilter from "@/Components/ProductComponet/ProductFilter";


const Products = () => {
   const [filters, setFilters] = useState<Partial<GetAllProductParams>>({});
    const [page, setPage] = useState(1);
  const limit = 10;


  const { data, isLoading } = useQuery({
  queryKey: ["products", page, filters],
    queryFn: async () => {
      return await getAllProduct({
        currentPage: page,
        limit: limit,
          ...filters,
      });
    },
    placeholderData: (prev) => prev, // keep old data while fetching new
  });

  if (isLoading) return <p>Loading...</p>;

  const products = data?.data as Product[] || [];
  const totalPages = data?.totalPages || 1;
 

  return (
    <div className="p-4">
        <div>
            <h1 className="text-2xl font-bold my-3 ">Stock Products</h1>
        </div>

              {/* 🔥 Filter Section */}
      <ProductFilter
        onFilterChange={(newFilters) => {
          setPage(1); // filter change করলে page reset
          setFilters(newFilters);
        }}
      />

         {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <ProductTableView products={products} />
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <ProductCardView products={products} />
          </div>

          {/* Pagination */}
          <DashPaginationButton
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </>
      )}

    </div>
  );
};

export default Products;



