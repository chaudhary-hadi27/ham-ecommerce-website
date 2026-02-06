// src/components/Admin/AdminHeader.tsx
'use client'

import { Menu, User } from 'lucide-react'

interface AdminHeaderProps {
    onMenuClick: () => void
    adminEmail?: string
}

export default function AdminHeader({ onMenuClick, adminEmail }: AdminHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Spacer for desktop */}
                <div className="hidden lg:block" />

                {/* Admin info */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {adminEmail || 'Admin'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}
