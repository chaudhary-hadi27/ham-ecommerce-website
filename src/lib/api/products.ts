// src/lib/api/products.ts
// API functions for fetching products from Supabase

import { createClient } from '@/lib/supabase/server'
import { SupabaseProduct } from '@/types/supabase'

/**
 * Get all products with optional filters
 */
export async function getProducts(params?: {
    category?: string
    featured?: boolean
    limit?: number
    search?: string
    minPrice?: number
    maxPrice?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    // Apply filters
    if (params?.category) {
        query = query.eq('category', params.category)
    }

    if (params?.featured !== undefined) {
        query = query.eq('is_featured', params.featured)
    }

    if (params?.search) {
        query = query.ilike('title', `%${params.search}%`)
    }

    if (params?.minPrice !== undefined) {
        query = query.gte('discounted_price', params.minPrice)
    }

    if (params?.maxPrice !== undefined) {
        query = query.lte('discounted_price', params.maxPrice)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data as SupabaseProduct[]
}

/**
 * Get featured products (for homepage)
 */
export async function getFeaturedProducts(limit: number = 8) {
    return getProducts({ featured: true, limit })
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return data as SupabaseProduct
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categorySlug)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products by category:', error)
        return []
    }

    return data as SupabaseProduct[]
}

/**
 * Get related products (same category, exclude current product)
 */
export async function getRelatedProducts(productId: string, category: string, limit: number = 4) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', productId)
        .limit(limit)

    if (error) {
        console.error('Error fetching related products:', error)
        return []
    }

    return data as SupabaseProduct[]
}

/**
 * Search products
 */
export async function searchProducts(searchTerm: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error searching products:', error)
        return []
    }

    return data as SupabaseProduct[]
}