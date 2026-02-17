'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  HiComputerDesktop,
  HiAcademicCap,
  HiBolt,
  HiWrench,
  HiGlobeAlt,
  HiChartBar,
  HiCube,
  HiShoppingBag,
  HiShoppingCart,
  HiFire
} from 'react-icons/hi2'
import { BiPalette } from 'react-icons/bi'

interface Category {
  name: string
  slug: string
  icon: any
  count: string
  href: string
}

interface FeaturedItem {
  title: string
  href: string
  tag?: string
  tagColor?: string
}

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

const categories: Category[] = [
  { name: 'Laptop', slug: 'laptop', icon: HiComputerDesktop, count: '50+', href: '/products?category=laptop' },
  { name: 'Khóa học', slug: 'course', icon: HiAcademicCap, count: '30+', href: '/products?category=course' },
  { name: 'Software', slug: 'software', icon: HiBolt, count: '40+', href: '/products?category=software' },
  { name: 'Công cụ Dev', slug: 'tools', icon: HiWrench, count: '25+', href: '/products?category=tools' },
  { name: 'Hosting', slug: 'hosting', icon: HiGlobeAlt, count: '15+', href: '/products?category=hosting' },
  { name: 'Design', slug: 'design', icon: BiPalette, count: '20+', href: '/products?category=design' },
  { name: 'Marketing', slug: 'marketing', icon: HiChartBar, count: '18+', href: '/products?category=marketing' },
  { name: 'Amazon', slug: 'amazon', icon: HiCube, count: 'HOT', href: '/blog?category=amazon' },
]

const featuredSections = {
  trending: [
    { title: 'Top 10 Laptop Amazon 2026', href: '/articles/top-10-laptop-tot-nhat-tren-amazon-2026', tag: 'NEW', tagColor: 'bg-green-500' },
    { title: 'Best Laptops 2026', href: '/best-laptops', tag: 'POPULAR', tagColor: 'bg-blue-500' },
    { title: 'Laptop Comparison Tool', href: '/laptop-comparison', tag: 'TOOL', tagColor: 'bg-purple-500' },
  ],
  platforms: [
    { title: 'Amazon Deals', href: '/blog?category=amazon', tag: 'HOT', tagColor: 'bg-orange-500' },
    { title: 'Rakuten Cashback', href: '/blog?category=rakuten', tag: 'NEW', tagColor: 'bg-blue-500' },
    { title: 'Shopee Flash Sale', href: '/blog?category=shopee', tag: 'SALE', tagColor: 'bg-red-500' },
  ]
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Mega Menu Content */}
      <div className="absolute left-0 right-0 top-full mt-0 z-50 animate-slideDown">
        <div className="bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 shadow-elevation-4">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left: Categories Grid (8 columns) */}
              <div className="col-span-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Danh mục sản phẩm
                  </h3>
                  <Link 
                    href="/products" 
                    onClick={onClose}
                    className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                    <Link
                      key={category.slug}
                      href={category.href}
                      onClick={onClose}
                      onMouseEnter={() => setHoveredCategory(category.slug)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`group relative p-4 rounded-xl border-2 transition-all ${
                        hoveredCategory === category.slug
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-elevation-2'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-4xl mb-2 transition-transform flex items-center justify-center ${
                          hoveredCategory === category.slug ? 'scale-110' : ''
                        }`}>
                          <IconComponent className="w-10 h-10" />
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {category.name}
                        </div>
                        <div className={`text-xs font-medium inline-block px-2 py-0.5 rounded-full ${
                          category.count === 'HOT' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {category.count}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      {hoveredCategory === category.slug && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-bounceX" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  )})}
                </div>
              </div>

              {/* Right: Featured & Partners (4 columns) */}
              <div className="col-span-4 space-y-6">
                {/* Trending Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <HiFire className="w-5 h-5" />
                    <span>Trending</span>
                  </h3>
                  <div className="space-y-2">
                    {featuredSections.trending.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={onClose}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {item.title}
                          </span>
                          {item.tag && item.tagColor && (
                            <span className={`${item.tagColor} text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Partner Platforms */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>🤝</span>
                    <span>Đối tác</span>
                  </h3>
                  <div className="space-y-2">
                    {featuredSections.platforms.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {item.tag}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </span>
                        <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl p-6 text-white shadow-elevation-3">
                  <div className="text-3xl mb-2">💎</div>
                  <h4 className="font-bold text-lg mb-2">
                    Deals Hôm Nay
                  </h4>
                  <p className="text-sm text-white/90 mb-4">
                    Tiết kiệm đến 70% với các deals độc quyền
                  </p>
                  <Link
                    href="/deals"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-white text-brand-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Xem ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
