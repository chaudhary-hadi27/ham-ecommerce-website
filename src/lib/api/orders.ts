// src/lib/api/orders.ts
// API functions for order management

import { createClient } from '@/lib/supabase/server'

export interface Order {
    id: string
    order_number: string
    user_id: string | null
    customer_name: string
    customer_email: string
    customer_phone: string
    shipping_address: string
    city: string
    total_amount: number
    currency: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    payment_method: string
    notes: string | null
    created_at: string
    updated_at: string
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    product_title: string
    quantity: number
    price: number
    created_at: string
}

export interface OrderWithItems extends Order {
    items: OrderItem[]
}

/**
 * Get all orders with optional filters
 */
export async function getOrders(params?: {
    status?: string
    search?: string
    limit?: number
    offset?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    // Apply filters
    if (params?.status) {
        query = query.eq('status', params.status)
    }

    if (params?.search) {
        query = query.or(`order_number.ilike.%${params.search}%,customer_name.ilike.%${params.search}%,customer_email.ilike.%${params.search}%`)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching orders:', error)
        return []
    }

    return data as Order[]
}

/**
 * Get single order by ID with items
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
    const supabase = await createClient()

    // Get order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

    if (orderError || !order) {
        console.error('Error fetching order:', orderError)
        return null
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

    if (itemsError) {
        console.error('Error fetching order items:', itemsError)
        return { ...order, items: [] } as OrderWithItems
    }

    return { ...order, items: items || [] } as OrderWithItems
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: Order['status']) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()

    if (error) {
        console.error('Error updating order status:', error)
        throw error
    }

    return data as Order
}

/**
 * Delete order (admin only)
 */
export async function deleteOrder(orderId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

    if (error) {
        console.error('Error deleting order:', error)
        throw error
    }

    return true
}

/**
 * Get recent orders for dashboard
 */
export async function getRecentOrders(limit: number = 10) {
    return getOrders({ limit })
}
