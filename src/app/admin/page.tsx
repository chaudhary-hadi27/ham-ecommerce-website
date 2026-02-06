// src/app/admin/page.tsx
import { requireAdmin } from '@/lib/api/admin'
import { getDashboardStats, getLowStockProducts } from '@/lib/api/stats'
import { getRecentOrders } from '@/lib/api/orders'
import StatsCard from '@/components/Admin/StatsCard'
import OrderStatusBadge from '@/components/Admin/OrderStatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Package, ShoppingCart, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    // Protect route
    await requireAdmin()

    // Fetch dashboard data
    const stats = await getDashboardStats()
    const recentOrders = await getRecentOrders(10)
    const lowStockProducts = await getLowStockProducts(10)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to HAM Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="blue"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="green"
                />
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    color="purple"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    color="orange"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No orders yet</p>
                        ) : (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">
                                            {order.order_number}
                                        </span>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>{order.customer_name}</span>
                                        <span className="font-medium">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(order.created_at, true)}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
                    </div>

                    <div className="space-y-3">
                        {lowStockProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">All products are well stocked</p>
                        ) : (
                            lowStockProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}/edit`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{product.title}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock === 0
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/products/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <span className="font-medium text-gray-700">Add New Product</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <span className="font-medium text-gray-700">View Orders</span>
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <span className="font-medium text-gray-700">Manage Categories</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
