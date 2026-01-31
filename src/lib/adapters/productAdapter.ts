// src/lib/adapters/productAdapter.ts
// Adapter to convert Supabase products to component-compatible format

import { SupabaseProduct } from '@/types/supabase';
import { Product } from '@/types/product';

/**
 * Convert database product to component format
 * This allows existing components to work with Supabase data
 */
export function adaptProductForComponent(dbProduct: SupabaseProduct): Product {
    return {
        id: parseInt(dbProduct.id.substring(0, 8), 16), // Convert UUID to number for components
        title: dbProduct.title,
        reviews: dbProduct.reviews,
        price: dbProduct.price,
        discountedPrice: dbProduct.discounted_price || dbProduct.price,
        imgs: {
            thumbnails: dbProduct.images,
            previews: dbProduct.images,
        },
    };
}

/**
 * Convert array of database products to component format
 */
export function adaptProductsForComponents(dbProducts: SupabaseProduct[]): Product[] {
    return dbProducts.map(adaptProductForComponent);
}

/**
 * Convert database product to detailed format (for product details page)
 */
export function adaptProductWithDetails(dbProduct: SupabaseProduct) {
    return {
        ...adaptProductForComponent(dbProduct),
        description: dbProduct.description,
        category: dbProduct.category,
        slug: dbProduct.slug,
        stock: dbProduct.stock,
        is_featured: dbProduct.is_featured,
        currency: dbProduct.currency,
        images: dbProduct.images,
    };
}