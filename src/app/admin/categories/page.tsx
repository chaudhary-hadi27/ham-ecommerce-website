// src/app/admin/categories/page.tsx
import { requireAdmin } from '@/lib/api/admin'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { FolderOpen } from 'lucide-react'
import AddCategoryButton from '@/components/Admin/AddCategoryButton'
import EditCategoryButton from '@/components/Admin/EditCategoryButton'
import DeleteCategoryButton from '@/components/Admin/DeleteCategoryButton'

export default async function AdminCategoriesPage() {
    await requireAdmin()

    const supabase = await createClient()

    // Get categories with product count
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('title')

    // Get product counts for each category
    const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
            const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category', category.slug)

            return { ...category, productCount: count || 0 }
        })
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage product categories</p>
                </div>
                <AddCategoryButton />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesWithCount.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No categories found. Add your first category to get started.
                    </div>
                ) : (
                    categoriesWithCount.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Category Image */}
                            <div className="relative h-48 bg-gray-100">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover"
                                        unoptimized={category.image.includes('unsplash.com')}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <FolderOpen className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Category Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    {category.slug}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <EditCategoryButton category={category} />
                                        <DeleteCategoryButton
                                            categoryId={category.id}
                                            hasProducts={category.productCount > 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
