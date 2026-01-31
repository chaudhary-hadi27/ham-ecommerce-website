import Home from "@/components/Home";
import { Metadata } from "next";
import { getFeaturedProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { adaptProductsForComponents } from "@/lib/adapters/productAdapter";

export const metadata: Metadata = {
    title: "HAM - Premium Ladies Bags | hum.com.pk",
    description: "Shop premium quality ladies bags at HAM.",
};

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
    const [dbProducts, categories] = await Promise.all([
        getFeaturedProducts(8),
        getCategories(),
    ]);

    // Convert to component format
    const products = adaptProductsForComponents(dbProducts);

    return <Home products={products} categories={categories} />;
}