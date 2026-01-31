// src/lib/cloudinary.ts
// Cloudinary helper for image uploads

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
 * Get optimized image URL from Cloudinary
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param quality - Image quality (default: 80)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
    url: string,
    width: number = 800,
    quality: number = 80
): string {
    if (!url || !url.includes('cloudinary.com')) return url

    const parts = url.split('/upload/')
    if (parts.length !== 2) return url

    return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`
}