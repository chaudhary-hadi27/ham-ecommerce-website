// src/app/admin/layout.tsx
'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import AdminHeader from '@/components/Admin/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-64">
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
