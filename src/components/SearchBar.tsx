'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HiMagnifyingGlass,
  HiCommandLine,
  HiArrowRight,
  HiXMark,
  HiComputerDesktop,
  HiDevicePhoneMobile,
  HiCamera
} from 'react-icons/hi2'
import {
  BiLaptop,
  BiHeadphone,
  BiMouse,
  BiJoystick,
  BiDesktop
} from 'react-icons/bi'

interface Category {
  id: string
  name: string
  icon: any
  productCount: number
  href: string
}

interface Product {
  id: string
  name: string
  category: string
  price: string
  href: string
  image?: string
}

interface SearchBarProps {
  compact?: boolean
}

export default function SearchBar({ compact = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Categories data
  const categories: Category[] = [
    { id: 'laptop', name: 'Laptop', icon: BiLaptop, productCount: 156, href: '/products?category=laptop' },
    { id: 'headphone', name: 'Tai nghe', icon: BiHeadphone, productCount: 89, href: '/products?category=headphone' },
    { id: 'mouse', name: 'Chuột', icon: BiMouse, productCount: 124, href: '/products?category=mouse' },
    { id: 'keyboard', name: 'Bàn phím', icon: BiJoystick, productCount: 67, href: '/products?category=keyboard' },
    { id: 'camera', name: 'Camera', icon: HiCamera, productCount: 45, href: '/products?category=camera' },
    { id: 'phone', name: 'Điện thoại', icon: HiDevicePhoneMobile, productCount: 203, href: '/products?category=phone' },
    { id: 'watch', name: 'Đồng hồ', icon: HiComputerDesktop, productCount: 78, href: '/products?category=watch' },
    { id: 'monitor', name: 'Màn hình', icon: BiDesktop, productCount: 92, href: '/products?category=monitor' },
  ]

  // Popular products data
  const popularProducts: Product[] = [
    { id: '1', name: 'MacBook Pro M3 2024', category: 'Laptop', price: '$1,999', href: '/products/macbook-pro-m3' },
    { id: '2', name: 'Sony WH-1000XM5', category: 'Tai nghe', price: '$399', href: '/products/sony-wh1000xm5' },
    { id: '3', name: 'Logitech MX Master 3S', category: 'Chuột', price: '$99', href: '/products/mx-master-3s' },
    { id: '4', name: 'Keychron Q1 Pro', category: 'Bàn phím', price: '$199', href: '/products/keychron-q1' },
    { id: '5', name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: '$1,199', href: '/products/iphone-15-pro' },
    { id: '6', name: 'Apple Watch Series 9', category: 'Đồng hồ', price: '$399', href: '/products/apple-watch-9' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsFocused(true)
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setIsFocused(false)
      setQuery('')
    }
  }

  const handleClearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <HiMagnifyingGlass className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Tìm kiếm sản phẩm, deals, bài viết..."
          className={`w-full pr-20 pl-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all ${
            compact ? 'py-2 text-sm' : 'py-3'
          } ${isFocused ? 'border-brand-500' : ''}`}
          aria-label="Search"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        )}

        {/* Keyboard Shortcut Hint (Desktop) */}
        {/* !compact && !query && (
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 text-xs text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
            <HiCommandLine className="w-3 h-3" />
            <kbd className="font-mono">K</kbd>
          </div>
        )*/}
      </form>

      {/* Mega Menu - Show on focus */}
      {isFocused && !compact && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 animate-fadeIn"
            onClick={() => setIsFocused(false)}
          />
          
          {/* Mega Menu Content */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-screen max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeInScale z-50">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {query ? `Kết quả cho "${query}"` : 'Khám phá sản phẩm'}
                </h3>
                <button
                  onClick={() => setIsFocused(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Categories Column */}
                <div className="col-span-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Danh mục
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {categories.length} danh mục
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group border border-transparent hover:border-brand-200 dark:hover:border-brand-800"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <category.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {category.productCount} sản phẩm
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="col-span-0.5 flex justify-center">
                  <div className="w-px h-full bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Popular Products Column */}
                <div className="col-span-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Sản phẩm phổ biến
                    </h4>
                    <Link 
                      href="/deals"
                      onClick={() => setIsFocused(false)}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium flex items-center gap-1"
                    >
                      Xem deals
                      <HiArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {popularProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">{product.category}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">{product.price}</span>
                          </div>
                        </div>
                        <HiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono">ESC</kbd> để đóng
                  </div>
                  {query && (
                    <button
                      onClick={handleSearch}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Tìm kiếm tất cả
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
