// src/app/(site)/(pages)/shop-details/[slug]/page.tsx
// Dynamic product details page

import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found | HAM",
        };
    }

    return {
        title: `${product.title} | HAM - hum.com.pk`,
        description: product.description || `Buy ${product.title} at best price in Pakistan`,
        openGraph: {
            images: product.images.length > 0 ? [product.images[0]] : [],
        },
    };
}

export default async function ShopDetailsPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Get related products
    const relatedProducts = await getRelatedProducts(
        product.id,
        product.category,
        4
    );

    return (
        <main>
            <ShopDetails
                product={product}
                relatedProducts={relatedProducts}
            />
        </main>
    );
}