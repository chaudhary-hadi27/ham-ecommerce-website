// src/app/admin/products/[id]/edit/page.tsx
import { requireAdmin } from '@/lib/api/admin'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/Admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()

    const { id } = await params

    const supabase = await createClient()

    // Get product
    const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (productError || !product) {
        notFound()
    }

    // Get categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('title')

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update product information</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ProductForm product={product} categories={categories || []} />
            </div>
        </div>
    )
}
