// src/lib/api/stats.ts
// Dashboard statistics API functions

import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    lowStockProducts: number
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient()

    // Get total products
    const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // Get total orders
    const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    // Get total revenue
    const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .in('status', ['processing', 'shipped', 'delivered'])

    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get pending orders count
    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // Get low stock products (stock < 10)
    const { count: lowStockProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 10)

    return {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders || 0,
        lowStockProducts: lowStockProducts || 0
    }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(threshold: number = 10) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('id, title, slug, stock, images')
        .lt('stock', threshold)
        .order('stock', { ascending: true })

    if (error) {
        console.error('Error fetching low stock products:', error)
        return []
    }

    return data
}
