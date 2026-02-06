// src/components/Admin/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadMultipleImages } from '@/lib/cloudinary'
import { generateSlug } from '@/lib/formatters'
import { Loader2, X, Upload } from 'lucide-react'
import Image from 'next/image'
import { productSchema, type ProductFormData } from '@/lib/validation/product'
import { ZodError } from 'zod'

interface ProductFormProps {
    product?: any
    categories: any[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})
    const [uploadingImages, setUploadingImages] = useState(false)

    // Form state
    const [formData, setFormData] = useState<ProductFormData>({
        title: product?.title || '',
        slug: product?.slug || '',
        description: product?.description || '',
        price: product?.price || 0,
        discounted_price: product?.discounted_price || null,
        category: product?.category || '',
        stock: product?.stock || 0,
        is_featured: product?.is_featured || false,
        images: product?.images || []
    })

    // Auto-generate slug from title
    useEffect(() => {
        if (!product && formData.title) {
            setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }))
        }
    }, [formData.title, product])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImages(true)
        setError('')

        try {
            const fileArray = Array.from(files)
            const uploadedUrls = await uploadMultipleImages(fileArray)
            setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }))
        } catch (err) {
            setError('Failed to upload images. Please try again.')
            console.error(err)
        } finally {
            setUploadingImages(false)
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))

        // Clear error for field
        if (formErrors[name as keyof ProductFormData]) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name as keyof ProductFormData]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setFormErrors({})

        try {
            // Validate with Zod
            const validatedData = productSchema.parse(formData)

            const supabase = createClient()

            const productData = {
                ...validatedData,
                category_id: categories.find(c => c.slug === validatedData.category)?.id || null,
                currency: 'PKR'
            }

            if (product) {
                // Update existing product
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id)

                if (updateError) throw updateError
            } else {
                // Create new product
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([productData])

                if (insertError) throw insertError
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            if (err instanceof ZodError) {
                const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {}
                err.errors.forEach(error => {
                    const field = error.path[0] as keyof ProductFormData
                    fieldErrors[field] = error.message
                })
                setFormErrors(fieldErrors)
                setError('Please fix the validation errors below.')
            } else {
                setError(err.message || 'Failed to save product')
            }
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Elegant Leather Handbag"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.slug ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="elegant-leather-handbag"
                    />
                    {formErrors.slug && <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (PKR) *
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="8500"
                    />
                    {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                </div>

                {/* Discounted Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discounted Price (PKR)
                    </label>
                    <input
                        type="number"
                        name="discounted_price"
                        value={formData.discounted_price || ''}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.discounted_price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="6999"
                    />
                    {formErrors.discounted_price && <p className="text-red-500 text-sm mt-1">{formErrors.discounted_price}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                                {cat.title}
                            </option>
                        ))}
                    </select>
                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity *
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${formErrors.stock ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="25"
                    />
                    {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Premium quality leather handbag with spacious interior..."
                />
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                </label>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                    unoptimized={img.includes('unsplash.com')}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {formErrors.images && <p className="text-red-500 text-sm mb-2">{formErrors.images}</p>}

                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                    >
                        {uploadingImages ? (
                            <>
                                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-2" />
                                <span className="text-sm text-gray-600">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-700">
                                    Click to upload images
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    PNG, JPG up to 10MB
                                </span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Feature this product on homepage
                </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        product ? 'Update Product' : 'Create Product'
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
