// src/components/Admin/OrderStatusBadge.tsx
interface OrderStatusBadgeProps {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

const statusConfig = {
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    processing: {
        label: 'Processing',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    shipped: {
        label: 'Shipped',
        className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    delivered: {
        label: 'Delivered',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200'
    }
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            {config.label}
        </span>
    )
}
