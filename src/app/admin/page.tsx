'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Page {
  name: string
  label: string
}

export default function AdminPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify')
      const data = await response.json()

      if (response.ok && data.authenticated) {
        setAuthenticated(true)
        setUsername(data.username)
        loadPages()
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const loadPages = async () => {
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      
      if (response.ok) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang xác thực...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Redirecting to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎛️ Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Quản lý nội dung website · Xin chào, <strong>{username}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-button font-semibold hover:bg-red-600 transition-colors"
          >
            🚪 Đăng xuất
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {pages.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Trang có thể chỉnh sửa
            </div>
          </div>

          <Link href="/admin/products" className="card card-interactive p-6">
            <div className="text-3xl mb-2">🛍️</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Products
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quản lý sản phẩm
            </div>
          </Link>

          <Link href="/admin/categories" className="card card-interactive p-6">
            <div className="text-3xl mb-2">📁</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Categories
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Quản lý danh mục
            </div>
          </Link>

          <Link href="/editor" className="card card-interactive p-6">
            <div className="text-3xl mb-2">✍️</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Blog Editor
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Viết bài blog mới
            </div>
          </Link>
        </div>

        {/* Management Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pages Management */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📝 Quản lý nội dung trang
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pages.map((page) => (
                  <Link
                    key={page.name}
                    href={`/admin/edit/${page.name}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-button hover:shadow-elevation-2 transition-all group border-2 border-transparent hover:border-brand-500"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {page.label}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Chỉnh sửa nội dung
                        </p>
                      </div>
                      <div className="text-xl group-hover:scale-110 transition-transform">
                        ✏️
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ⚡ Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-button hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">🛍️ Quản lý Products</h3>
                    <p className="text-xs text-blue-100">Thêm, sửa, xóa sản phẩm</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </Link>

              <Link
                href="/admin/categories"
                className="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-button hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">📁 Quản lý Categories</h3>
                    <p className="text-xs text-purple-100">Tổ chức danh mục sản phẩm</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </Link>

              <Link
                href="/editor"
                className="block p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-button hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">✍️ Viết bài Blog</h3>
                    <p className="text-xs text-green-100">Tạo bài viết mới</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </Link>

              <a
                href="/library"
                target="_blank"
                className="block p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-button hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">📚 Thư viện bài viết</h3>
                    <p className="text-xs text-orange-100">Xem tất cả bài đã viết</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </a>

              <Link
                href="/admin/history"
                className="block p-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-button hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">📊 Lịch sử & Analytics</h3>
                    <p className="text-xs text-cyan-100">Backup và phân tích dữ liệu</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Tools */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💾 Data Storage
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-600 dark:text-gray-400">Products</span>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-500">
                  data/affiliate-data.json
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-600 dark:text-gray-400">Categories</span>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-500">
                  data/categories.json
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-600 dark:text-gray-400">Pages Content</span>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-500">
                  data/pages-content.json
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                💡 Tip: Có thể sync với Google Drive để backup tự động
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🔗 Quick Links
            </h3>
            <div className="space-y-2">
              <a href="/" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → Xem trang chủ
              </a>
              <a href="/deals" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → Xem deals
              </a>
              <a href="/products" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → Xem sản phẩm
              </a>
              <a href="/contact" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → Trang liên hệ
              </a>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <a href="/library" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → Thư viện bài viết
              </a>
              <a href="/reader" target="_blank" className="block text-brand-600 dark:text-brand-400 hover:underline text-sm">
                → PDF Reader
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
