import { useState, useEffect } from 'react'
import { FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'
import type { AdminProduct, ProductFormData } from '../../types/admin'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  product?: AdminProduct | null
}

const ProductForm = ({ isOpen, onClose, onSubmit, product }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    images: [],
    tags: [],
    sku: '',
    barcode: '',
    weight: undefined,
    shippingInformation: '',
    returnPolicy: '',
    warranty: '',
    isActive: true,
    featured: false,
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'kitchen-accessories',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
        images: product.images,
        tags: product.tags,
        sku: product.sku,
        barcode: product.barcode || '',
        weight: product.weight,
        shippingInformation: product.shippingInformation,
        returnPolicy: product.returnPolicy,
        warranty: product.warranty || '',
        isActive: product.isActive,
        featured: product.featured,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        discountPercentage: 0,
        stock: 0,
        brand: '',
        category: '',
        thumbnail: '',
        images: [],
        tags: [],
        sku: '',
        barcode: '',
        weight: undefined,
        shippingInformation: '',
        returnPolicy: '',
        warranty: '',
        isActive: true,
        featured: false,
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      alert('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleAddImage = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
    }
  }

  const handleRemoveImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-nav max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--border-glass)] bg-white/80 p-4 backdrop-blur-xl dark:bg-gray-900/80 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Category & Tags
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag and press Enter"
                  className="flex-1 rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="shrink-0 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  <FiPlus size={20} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-purple-800 dark:hover:text-purple-200"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Images
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Thumbnail URL *
              </label>
              <input
                type="url"
                required
                value={formData.thumbnail}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              />
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="mt-2 h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Images
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-purple-500 hover:text-purple-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-purple-400 dark:hover:text-purple-400 sm:w-auto"
              >
                <FiUpload size={20} />
                Add Image URL
              </button>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-20 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Product Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Barcode
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Shipping Information *
              </label>
              <input
                type="text"
                required
                value={formData.shippingInformation}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingInformation: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Return Policy *
              </label>
              <input
                type="text"
                required
                value={formData.returnPolicy}
                onChange={(e) => setFormData(prev => ({ ...prev, returnPolicy: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Warranty
              </label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                className="w-full rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-xl transition-colors focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:focus:border-purple-400/50 dark:focus:ring-purple-400/20"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              Status
            </h3>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200/50 pt-4 dark:border-gray-700/50 sm:flex-row sm:justify-end sm:gap-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-gray-200/50 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto sm:py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
