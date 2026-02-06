// src/app/admin/orders/[id]/page.tsx
import { requireAdmin } from '@/lib/api/admin'
import { getOrderById } from '@/lib/api/orders'
import { formatCurrency, formatDate } from '@/lib/formatters'
import OrderStatusBadge from '@/components/Admin/OrderStatusBadge'
import UpdateOrderStatus from '@/components/Admin/UpdateOrderStatus'
import { notFound } from 'next/navigation'
import { MapPin, Mail, Phone, CreditCard, Package } from 'lucide-react'
import Link from 'next/link'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    await requireAdmin()

    const { id } = await params
    const order = await getOrderById(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-gray-600 mt-1">{order.order_number}</p>
                </div>
                <Link
                    href="/admin/orders"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.product_title}</div>
                                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatCurrency(item.price)} each
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Name</div>
                                    <div className="font-medium text-gray-900">{order.customer_name}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Email</div>
                                    <div className="font-medium text-gray-900">{order.customer_email}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Phone</div>
                                    <div className="font-medium text-gray-900">{order.customer_phone}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Shipping Address</div>
                                    <div className="font-medium text-gray-900">{order.shipping_address}</div>
                                    <div className="text-sm text-gray-600">{order.city}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Payment Method</div>
                                    <div className="font-medium text-gray-900 uppercase">{order.payment_method}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-2">Current Status</div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Info</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-gray-500">Order Date</div>
                                <div className="font-medium text-gray-900">{formatDate(order.created_at, true)}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Last Updated</div>
                                <div className="font-medium text-gray-900">{formatDate(order.updated_at, true)}</div>
                            </div>
                            {order.notes && (
                                <div>
                                    <div className="text-gray-500">Notes</div>
                                    <div className="font-medium text-gray-900">{order.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
