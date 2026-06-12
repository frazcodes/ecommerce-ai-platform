/**
 * Admin Customers Page
 * 
 * Purpose: Customer management interface for admin
 * Why it exists: Allows admin to view customer details and order history
 * Features: Customer list, search, filter, view details
 */

import { useState } from 'react'
import { FiSearch, FiEye, FiFilter } from 'react-icons/fi'
import { useAdminCustomers } from '../../hooks/useAdminCustomers'

const CustomersPage = () => {
  const { customers, loading, error, total, refresh } = useAdminCustomers()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null)

  const statusOptions = ['all', 'active', 'inactive', 'blocked']

  const statusColors = {
    active: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
    blocked: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center">
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Customers
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage customer accounts and view order history
        </p>
      </div>

      {/* Filters */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200/50 bg-white/80 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive' | 'blocked')}
              className="rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
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

      {/* Customers Table */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 overflow-hidden backdrop-blur-xl dark:bg-gray-900/80">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Total Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.fullName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                            {customer.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {customer.fullName}
                          </p>
                          {customer.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 dark:text-gray-100">
                        {customer.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {customer.totalOrders}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ${customer.totalSpent.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[customer.status]}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                          <FiEye size={18} />
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
        <div className="flex items-center justify-between border-t border-gray-200/50 px-6 py-4 dark:border-gray-700/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCustomers.length} of {total} customers
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200/50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-800">
              Previous
            </button>
            <button className="rounded-lg border border-gray-200/50 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal - Placeholder */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-nav max-w-2xl rounded-2xl border border-[var(--border-glass)] bg-white/80 p-8 backdrop-blur-xl dark:bg-gray-900/80">
            <div className="flex items-center gap-4 mb-6">
              {selectedCustomer.avatar ? (
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.fullName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-semibold">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedCustomer.fullName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedCustomer.totalOrders}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Order History
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Order history will be implemented with full backend integration
              </p>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersPage
