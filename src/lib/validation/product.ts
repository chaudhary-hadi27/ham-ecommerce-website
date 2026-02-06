import { z } from 'zod';

export const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be positive'),
    discounted_price: z.coerce.number().min(0, 'Discounted price must be positive').optional().nullable(),
    category: z.string().min(1, 'Category is required'),
    stock: z.coerce.number().int().min(0, 'Stock must be a positive integer'),
    is_featured: z.boolean().default(false),
    images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
