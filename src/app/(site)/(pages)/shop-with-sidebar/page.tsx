import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { Metadata } from "next";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { adaptProductsForComponents } from "@/lib/adapters/productAdapter";

export const metadata: Metadata = {
  title: "Shop Page | HAM - Premium Ladies Bags",
  description: "Explore our collection of premium ladies bags at HAM.",
};

export const revalidate = 3600; // Cache for 1 hour

const ShopWithSidebarPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const minPrice = typeof resolvedSearchParams.minPrice === "string" ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === "string" ? Number(resolvedSearchParams.maxPrice) : undefined;
  const page = typeof resolvedSearchParams.page === "string" ? Number(resolvedSearchParams.page) : 1;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  const [dbProducts, categories] = await Promise.all([
    getProducts({
      category,
      minPrice,
      maxPrice,
      search,
      // limit: 12, // Optional: add pagination limit later if needed
    }),
    getCategories(),
  ]);

  // Convert to component format
  const products = adaptProductsForComponents(dbProducts);

  return (
    <main>
      <ShopWithSidebar initialProducts={products} categories={categories} />
    </main>
  );
};

export default ShopWithSidebarPage;
