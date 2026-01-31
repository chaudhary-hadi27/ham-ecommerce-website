// src/lib/utils.ts
// Utility functions

/**
 * Format price in PKR
 */
export function formatPrice(price: number, currency: string = 'PKR'): string {
    if (currency === 'PKR') {
        return `Rs. ${price.toLocaleString('en-PK')}`;
    }
    return `${currency} ${price.toLocaleString()}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Check if product is in stock
 */
export function isInStock(stock: number): boolean {
    return stock > 0;
}

/**
 * Get stock status text
 */
export function getStockStatus(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Only few left';
    return 'In Stock';
}

/**
 * Convert old product format to new database format
 */
export function convertProductFormat(oldProduct: any) {
    return {
        id: oldProduct.id?.toString() || '',
        title: oldProduct.title || '',
        slug: generateSlug(oldProduct.title || ''),
        description: oldProduct.description || null,
        price: oldProduct.price || 0,
        discounted_price: oldProduct.discountedPrice || oldProduct.price || 0,
        category: oldProduct.category || 'Handbags',
        images: oldProduct.imgs?.thumbnails || oldProduct.imgs?.previews || [oldProduct.img] || [],
        stock: oldProduct.stock || 0,
        is_featured: oldProduct.featured || false,
        reviews: oldProduct.reviews || 0,
        currency: 'PKR',
    };
}