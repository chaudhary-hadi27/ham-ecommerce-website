// src/components/Admin/DeleteProductButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteProductButtonProps {
    productId: string
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)

            if (error) throw error

            router.refresh()
            setShowConfirm(false)
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Failed to delete product')
        } finally {
            setLoading(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h3>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    )
}
