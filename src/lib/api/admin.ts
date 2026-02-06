// src/lib/api/admin.ts
// Admin authentication and authorization utilities

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Check if the current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const supabase = await createClient()

        // Get current user session
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return false
        }

        // Check if user email exists in admin_users table
        const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', user.email)
            .single()

        if (adminError || !adminUser) {
            return false
        }

        return true
    } catch (error) {
        console.error('Error checking admin status:', error)
        return false
    }
}

/**
 * Require admin access - redirect to login if not admin
 * Use this in admin page components
 */
export async function requireAdmin() {
    const adminStatus = await isAdmin()

    if (!adminStatus) {
        redirect('/signin')
    }
}

/**
 * Get current admin user info
 */
export async function getAdminUser() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    // Verify user is admin
    const adminStatus = await isAdmin()

    if (!adminStatus) {
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin'
    }
}

/**
 * Sign out admin user
 */
export async function signOutAdmin() {
    const supabase = await createClient()
    await supabase.auth.signOut()
}
