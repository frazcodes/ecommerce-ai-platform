/**
 * Admin Dashboard Page
 * 
 * Purpose: Main dashboard overview with stats and charts
 * Why it exists: Provides admin with quick overview of store performance
 * Features: Stats cards, revenue chart, orders chart, recent orders, top products
 */

import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { useAdminDashboard } from '../../hooks/useAdminDashboard'
import RevenueChart from '../../components/admin/RevenueChart'
import OrdersChart from '../../components/admin/OrdersChart'

const DashboardPage = () => {
  const {
    dashboardStats,
    revenueData,
    ordersData,
    topSellingProducts,
    loading,
    error,
    refresh,
  } = useAdminDashboard()

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

  if (!dashboardStats) {
    return null
  }

  const stats = [
    {
      label: 'Total Products',
      value: dashboardStats.totalProducts,
      icon: FiPackage,
      color: 'from-purple-600 to-pink-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Total Orders',
      value: dashboardStats.totalOrders,
      icon: FiShoppingBag,
      color: 'from-blue-600 to-cyan-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'from-green-600 to-emerald-600',
      trend: '+23%',
      trendUp: true,
    },
    {
      label: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: FiUsers,
      color: 'from-orange-600 to-red-600',
      trend: '+5%',
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {stat.trendUp ? (
                  <FiTrendingUp size={16} className="text-green-600" />
                ) : (
                  <FiTrendingDown size={16} className="text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  from last month
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dashboardStats.pendingOrders}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <FiShoppingBag size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Shipped Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dashboardStats.shippedOrders}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <FiShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Delivered Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {dashboardStats.deliveredOrders}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <FiShoppingBag size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Revenue Overview
          </h3>
          <RevenueChart data={revenueData} />
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Orders Overview
          </h3>
          <OrdersChart data={ordersData} />
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Top Selling Products
        </h3>
        <div className="space-y-4">
          {topSellingProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200/50 bg-white/50 p-4 dark:border-gray-700/50 dark:bg-gray-900/50"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.sold} sold
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  ${product.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
