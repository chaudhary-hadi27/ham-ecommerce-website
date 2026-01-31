// src/app/(site)/(pages)/shop-without-sidebar/page.tsx
// Updated Shop page with Supabase data

import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { Metadata } from "next";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

export const metadata: Metadata = {
    title: "Shop Ladies Bags | HAM - hum.com.pk",
    description: "Browse our collection of premium ladies bags. Free delivery across Pakistan.",
};

export const revalidate = 1800; // Revalidate every 30 minutes

interface SearchParams {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
}

export default async function ShopWithoutSidebarPage({
                                                         searchParams,
                                                     }: {
    searchParams: SearchParams;
}) {
    // Get filter parameters
    const filters = {
        category: searchParams.category,
        search: searchParams.search,
        minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    };

    // Fetch products and categories
    const [products, categories] = await Promise.all([
        getProducts(filters),
        getCategories(),
    ]);

    return (
        <main>
            <ShopWithoutSidebar
                products={products}
                categories={categories}
                currentFilters={filters}
            />
        </main>
    );
}