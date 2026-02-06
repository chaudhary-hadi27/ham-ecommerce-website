// src/lib/cloudinary.ts
// Cloudinary helper for image uploads and optimization

/**
 * Upload image to Cloudinary from client-side
 * @param file - File object from input
 * @param folder - Folder name in Cloudinary (default: 'ham-products')
 * @returns Promise with uploaded image URL
 */
export async function uploadImageClient(
    file: File,
    folder: string = 'ham-products'
): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ham_unsigned') // Create this in Cloudinary dashboard
    formData.append('folder', folder)

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        const data = await response.json()

        if (data.error) {
            throw new Error(data.error.message)
        }

        return data.secure_url
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of File objects
 * @param folder - Folder name in Cloudinary
 * @returns Promise with array of uploaded image URLs
 */
export async function uploadMultipleImages(
    files: File[],
    folder: string = 'ham-products'
): Promise<string[]> {
    const uploadPromises = files.map((file) => uploadImageClient(file, folder))
    return Promise.all(uploadPromises)
}

/**
 * Get optimized URL for an image (Cloudinary or Unsplash)
 * @param url Original URL
 * @param options Optimization options (width, quality, etc.)
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: string | number;
        format?: string;
        crop?: string;
    } = {}
) {
    if (!url) return '';

    const {
        width,
        height,
        quality = 80, // Default quality for Unsplash/Cloudinary
        format = 'auto',
        crop = 'fill'
    } = options;

    // Handle Unsplash optimization
    if (url.includes('images.unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        let params = [];

        if (width) params.push(`w=${width}`);
        if (height) params.push(`h=${height}`);

        // Unsplash quality is 0-100, "auto" is not valid for q param usually, but auto=format is.
        if (quality && typeof quality === 'number') {
            params.push(`q=${quality}`);
        }

        params.push('auto=format');
        params.push('fit=crop');

        return `${url}${separator}${params.join('&')}`;
    }

    // Handle Cloudinary optimization
    if (!url.includes('cloudinary.com')) return url;

    // Split at /upload/ to insert transformations
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transformations = [];
    transformations.push(`f_${format}`);

    // Cloudinary supports q_auto
    const qValue = quality === 'auto' ? 'auto' : quality;
    transformations.push(`q_${qValue}`);

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (width || height) transformations.push(`c_${crop}`);

    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
}

/**
 * Get thumbnail URL for product cards
 */
export function getProductThumbnailUrl(url: string) {
    return getOptimizedImageUrl(url, { width: 400, height: 400 });
}

/**
 * Get detail preview URL for product pages
 */
export function getProductPreviewUrl(url: string) {
    return getOptimizedImageUrl(url, { width: 800, height: 800 });
}