import { useState } from 'react'
import { FiSearch, FiEye, FiFilter } from 'react-icons/fi'
import { useAdminOrders } from '../../hooks/useAdminOrders'
import type { OrderStatus } from '../../types/admin'

const OrdersPage = () => {
  const { orders, loading, error, total, refresh, updateStatus } = useAdminOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')

  const statusOptions: (OrderStatus | 'all')[] = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus(orderId, newStatus)
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200/50 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="shrink-0 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
              className="rounded-lg border border-gray-200/50 bg-white/80 px-3 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 overflow-hidden backdrop-blur-xl dark:bg-gray-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-gray-200/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Status
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400 sm:px-6 sm:py-12">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-xs text-white font-semibold sm:h-10 sm:w-10 sm:text-sm">
                          {order.customer.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {order.customer.fullName}
                          </p>
                          <p className="hidden truncate text-xs text-gray-600 dark:text-gray-400 sm:block">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize sm:px-3 sm:py-1 ${statusColors[order.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 sm:p-2"
                        >
                          <FiEye size={16} className="sm:size-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-gray-200/50 px-4 py-3 dark:border-gray-700/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 sm:text-left sm:text-sm">
            Showing {filteredOrders.length} of {total} orders
          </p>
          <div className="flex justify-center gap-2">
            <button className="rounded-lg border border-gray-200/50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-800 sm:px-3 sm:py-1 sm:text-sm">
              Previous
            </button>
            <button className="rounded-lg border border-gray-200/50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-800 sm:px-3 sm:py-1 sm:text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
