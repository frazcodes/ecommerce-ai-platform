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
          Customers
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
          Manage customer accounts and view order history
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
              placeholder="Search customers..."
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
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive' | 'blocked')}
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

      {/* Customers Table */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 overflow-hidden backdrop-blur-xl dark:bg-gray-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-gray-200/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Total Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Status
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400 sm:px-6 sm:py-12">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.fullName}
                            className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm text-white font-semibold sm:h-12 sm:w-12">
                            {customer.fullName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {customer.fullName}
                          </p>
                          {customer.phone && (
                            <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="truncate text-sm text-gray-900 dark:text-gray-100">
                        {customer.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {customer.totalOrders}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${customer.totalSpent.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[customer.status]}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
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
            Showing {filteredCustomers.length} of {total} customers
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-nav w-full max-w-lg rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80 sm:max-w-2xl sm:p-8">
            <div className="flex flex-col items-center gap-4 mb-6 sm:flex-row">
              {selectedCustomer.avatar ? (
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.fullName}
                  className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-xl text-white font-semibold sm:text-2xl">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                  {selectedCustomer.fullName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 sm:gap-4">
              <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Total Orders</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                  {selectedCustomer.totalOrders}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50">
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Total Spent</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
                Order History
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order history will be implemented with full backend integration
              </p>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 sm:py-2"
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
