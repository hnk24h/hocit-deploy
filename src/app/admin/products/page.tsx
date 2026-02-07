'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className="text-gray-500">Đang tải editor...</div>
})

interface Product {
  slug: string
  name: string
  description: string
  image?: string
  images?: string[]
  price?: number
  currency?: string
  rating?: number
  reviewCount?: number
  affiliateLink: string
  pros: string[]
  cons: string[]
  category: string
  tags?: string[]
  featured?: boolean
  detailedReview?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      showMessage('error', 'Lỗi khi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreate = () => {
    setCurrentProduct({
      slug: '',
      name: '',
      description: '',
      category: '',
      affiliateLink: '',
      pros: [],
      cons: [],
      tags: [],
      featured: false,
    })
    setEditMode(true)
  }

  const handleEdit = (product: Product) => {
    setCurrentProduct(product)
    setEditMode(true)
  }

  const handleSave = async () => {
    if (!currentProduct) return

    try {
      const isNew = !products.find(p => p.slug === currentProduct.slug)
      const method = isNew ? 'POST' : 'PUT'
      
      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
      })

      const data = await response.json()

      if (response.ok) {
        showMessage('success', isNew ? 'Đã tạo sản phẩm' : 'Đã cập nhật sản phẩm')
        setEditMode(false)
        setCurrentProduct(null)
        loadProducts()
      } else {
        showMessage('error', data.error || 'Lỗi khi lưu')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showMessage('error', 'Lỗi khi lưu sản phẩm')
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      const response = await fetch(`/api/admin/products?slug=${slug}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        showMessage('success', 'Đã xóa sản phẩm')
        loadProducts()
      } else {
        showMessage('error', data.error || 'Lỗi khi xóa')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showMessage('error', 'Lỗi khi xóa sản phẩm')
    }
  }

  const updateField = (field: keyof Product, value: any) => {
    setCurrentProduct(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: 'pros' | 'cons' | 'tags' | 'images') => {
    if (field === 'images') {
      // For images, just add empty string for user to fill in
      setCurrentProduct(prev => ({
        ...prev,
        [field]: [...(prev?.[field] || []), '']
      }))
    } else {
      const value = prompt(`Nhập ${field}:`)
      if (value) {
        setCurrentProduct(prev => ({
          ...prev,
          [field]: [...(prev?.[field] || []), value]
        }))
      }
    }
  }

  const removeArrayItem = (field: 'pros' | 'cons' | 'tags' | 'images', index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: prev?.[field]?.filter((_, i) => i !== index) || []
    }))
  }

  const updateArrayItem = (field: 'pros' | 'cons' | 'tags' | 'images', index: number, value: string) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: prev?.[field]?.map((item, i) => i === index ? value : item) || []
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/admin"
              className="text-brand-600 dark:text-brand-400 hover:underline mb-2 inline-block"
            >
              ← Quay lại Admin
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🛍️ Quản lý Sản phẩm
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {products.length} sản phẩm
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-primary text-white rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 hover:scale-105 transition-all"
          >
            + Thêm sản phẩm
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-button mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Edit Form */}
        {editMode && currentProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-card p-8 max-w-3xl w-full my-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {products.find(p => p.slug === currentProduct.slug) ? 'Chỉnh sửa' : 'Thêm'} sản phẩm
              </h2>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={currentProduct.slug || ''}
                      onChange={(e) => updateField('slug', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="macbook-pro-m4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={currentProduct.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="MacBook Pro M4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={currentProduct.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mô tả sản phẩm..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={currentProduct.category || ''}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="laptop"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Affiliate Link *
                    </label>
                    <input
                      type="text"
                      value={currentProduct.affiliateLink || ''}
                      onChange={(e) => updateField('affiliateLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="amazon-laptop"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Giá
                    </label>
                    <input
                      type="number"
                      value={currentProduct.price || ''}
                      onChange={(e) => updateField('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="1999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      value={currentProduct.rating || ''}
                      onChange={(e) => updateField('rating', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="4.8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL (Ảnh chính)
                    </label>
                    <input
                      type="text"
                      value={currentProduct.image || ''}
                      onChange={(e) => updateField('image', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="/images/product.jpg"
                    />
                  </div>

                  {/* Multiple Images */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gallery Images (Nhiều ảnh)
                      </label>
                      <button
                        onClick={() => addArrayItem('images')}
                        className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                        type="button"
                      >
                        + Thêm ảnh
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(currentProduct.images || []).map((img, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => updateArrayItem('images', index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="URL ảnh"
                          />
                          <button
                            onClick={() => removeArrayItem('images', index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-button hover:bg-red-600"
                            type="button"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      💡 Thêm nhiều ảnh để hiển thị slide gallery trên trang sản phẩm
                    </p>
                  </div>
                </div>

                {/* Pros */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ưu điểm (Pros)
                    </label>
                    <button
                      onClick={() => addArrayItem('pros')}
                      className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      + Thêm
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentProduct.pros?.map((pro, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={pro}
                          onChange={(e) => {
                            const newPros = [...(currentProduct.pros || [])]
                            newPros[index] = e.target.value
                            updateField('pros', newPros)
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          onClick={() => removeArrayItem('pros', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-button hover:bg-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cons */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nhược điểm (Cons)
                    </label>
                    <button
                      onClick={() => addArrayItem('cons')}
                      className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      + Thêm
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentProduct.cons?.map((con, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={con}
                          onChange={(e) => {
                            const newCons = [...(currentProduct.cons || [])]
                            newCons[index] = e.target.value
                            updateField('cons', newCons)
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                          onClick={() => removeArrayItem('cons', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-button hover:bg-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentProduct.featured || false}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sản phẩm nổi bật
                  </label>
                </div>

                {/* Detailed Review - Markdown Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📝 Đánh giá chi tiết (Markdown)
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-button overflow-hidden">
                    <MarkdownEditor
                      content={currentProduct.detailedReview || ''}
                      onChange={(markdown) => updateField('detailedReview', markdown)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Sử dụng Markdown để format nội dung đánh giá chi tiết về sản phẩm
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setEditMode(false)
                    setCurrentProduct(null)
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-button font-semibold hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 transition-all"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.slug} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                    {product.featured && (
                      <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    {product.rating && (
                      <span>⭐ {product.rating}</span>
                    )}
                    {product.price && (
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-button text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(product.slug)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-button text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Chưa có sản phẩm
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thêm sản phẩm đầu tiên của bạn
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-primary text-white rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 hover:scale-105 transition-all"
            >
              + Thêm sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
