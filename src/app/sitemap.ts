import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://hum.com.pk' // Replace with actual domain

    // Get all products
    const products = await getProducts()

    // Get all categories
    const categories = await getCategories()

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/shop-details/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${baseUrl}/shop-with-sidebar?category=${category.slug}`,
        lastModified: new Date(category.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop-with-sidebar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...categoryEntries,
        ...productEntries,
    ]
}
