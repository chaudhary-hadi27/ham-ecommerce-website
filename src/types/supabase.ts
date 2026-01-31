// src/types/supabase.ts
// Supabase database types (renamed to avoid conflicts with existing types)

export interface Category {
    id: string
    title: string
    slug: string
    image: string | null
    created_at: string
}

export interface SupabaseProduct {
    id: string
    title: string
    slug: string
    description: string | null
    price: number
    discounted_price: number | null
    category_id: string | null
    category: string
    images: string[]
    stock: number
    is_featured: boolean
    reviews: number
    currency: string
    created_at: string
    updated_at: string
}

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
    payment_method: 'cod' | 'bank_transfer' | 'online'
    notes: string | null
    created_at: string
    updated_at: string
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string | null
    product_title: string
    quantity: number
    price: number
    created_at: string
}

export interface AdminUser {
    id: string
    email: string
    user_id: string | null
    role: string
    created_at: string
}