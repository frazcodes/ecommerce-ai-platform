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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-base">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:mt-2 sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
                <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${stat.color} p-3`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1 sm:mt-4 sm:gap-2">
                {stat.trendUp ? (
                  <FiTrendingUp size={16} className="shrink-0 text-green-600" />
                ) : (
                  <FiTrendingDown size={16} className="shrink-0 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium sm:text-sm ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  from last month
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
                Pending Orders
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mt-2 sm:text-2xl">
                {dashboardStats.pendingOrders}
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <FiShoppingBag size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
                Shipped Orders
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mt-2 sm:text-2xl">
                {dashboardStats.shippedOrders}
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <FiShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">
                Delivered Orders
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 sm:mt-2 sm:text-2xl">
                {dashboardStats.deliveredOrders}
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <FiShoppingBag size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Revenue Overview
          </h3>
          <RevenueChart data={revenueData} />
        </div>

        <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            Orders Overview
          </h3>
          <OrdersChart data={ordersData} />
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
          Top Selling Products
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {topSellingProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200/50 bg-white/50 p-3 dark:border-gray-700/50 dark:bg-gray-900/50 sm:gap-4 sm:p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100 sm:text-base">
                  {product.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  {product.sold} sold
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
                  ${product.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
