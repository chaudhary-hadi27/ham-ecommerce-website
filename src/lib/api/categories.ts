// src/lib/api/categories.ts
// API functions for fetching categories from Supabase

import { createClient } from '@/lib/supabase/server'
import { Category } from '@/types/supabase'

/**
 * Get all categories
 */
export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('title', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data as Category[]
}

/**
 * Get single category by slug
 */
export async function getCategoryBySlug(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching category:', error)
        return null
    }

    return data as Category
}

/**
 * Get category with product count
 */
export async function getCategoriesWithCount() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select(`
      *,
      products:products(count)
    `)
        .order('title', { ascending: true })

    if (error) {
        console.error('Error fetching categories with count:', error)
        return []
    }

    return data
}