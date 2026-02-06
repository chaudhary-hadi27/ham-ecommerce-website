// src/app/admin/products/new/page.tsx
import { requireAdmin } from '@/lib/api/admin'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/Admin/ProductForm'

export default async function NewProductPage() {
    await requireAdmin()

    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('title')

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ProductForm categories={categories || []} />
            </div>
        </div>
    )
}
