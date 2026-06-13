import { useState } from 'react'
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi'
import { useAdminProducts } from '../../hooks/useAdminProducts'
import type { AdminProduct } from '../../types/admin'

const ProductsPage = () => {
  const { products, loading, error, total, refresh, delete: deleteProduct } = useAdminProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = ['all', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
      } catch (err) {
        alert('Failed to delete product')
      }
    }
  }

  const handleEdit = (product: AdminProduct) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2">
            Manage your product inventory
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 sm:px-6 sm:py-3 sm:text-base"
        >
          <FiPlus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200/50 bg-white/80 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="shrink-0 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-200/50 bg-white/80 px-3 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-nav rounded-2xl border border-[var(--border-glass)] bg-white/80 overflow-hidden backdrop-blur-xl dark:bg-gray-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-gray-200/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 sm:px-6 sm:py-4 sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400 sm:px-6 sm:py-12">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200/50 transition-colors hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discountPercentage > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {product.discountPercentage}% off
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.stock}
                      </p>
                      <p className={`text-xs ${product.stock < 10 ? 'text-red-600' : 'text-gray-600'} dark:${product.stock < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                        {product.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </p>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 sm:p-2"
                        >
                          <FiEdit size={16} className="sm:size-[18px]" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 sm:p-2"
                        >
                          <FiTrash2 size={16} className="sm:size-[18px]" />
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
            Showing {filteredProducts.length} of {total} products
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

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-nav w-full max-w-lg rounded-2xl border border-[var(--border-glass)] bg-white/80 p-6 backdrop-blur-xl dark:bg-gray-900/80 sm:max-w-2xl sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Product form will be implemented in Step 10
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 sm:w-auto sm:py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
