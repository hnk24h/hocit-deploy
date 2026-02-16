'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Category } from '@/lib/categories'

interface CategoryListProps {
  categories: Category[]
  articles: Array<{ category: string }>
}

export default function CategoryList({ categories, articles }: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(slug)) {
        newSet.delete(slug)
      } else {
        newSet.add(slug)
      }
      return newSet
    })
  }

  const getArticleCount = (categorySlug: string) => {
    return articles.filter(a => a.category === categorySlug).length
  }

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories

    const query = searchQuery.toLowerCase()
    return categories.filter(category => {
      const matchesParent = category.name.toLowerCase().includes(query)
      const matchesChild = category.subCategories?.some(sub => 
        sub.name.toLowerCase().includes(query)
      )
      return matchesParent || matchesChild
    })
  }, [categories, searchQuery])

  // Auto-expand categories when searching
  const shouldExpand = (slug: string) => {
    if (!searchQuery.trim()) return expandedCategories.has(slug)
    
    const category = categories.find(c => c.slug === slug)
    if (!category?.subCategories) return false
    
    const query = searchQuery.toLowerCase()
    return category.subCategories.some(sub => 
      sub.name.toLowerCase().includes(query)
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* All Articles Link */}
      <Link
        href="/blog"
        className="group block relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity rounded-xl"></div>
        <div className="relative px-4 py-3 flex items-center justify-between text-white">
          <span className="flex items-center gap-2 font-semibold">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Tất cả bài viết</span>
          </span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
            {articles.length}
          </span>
        </div>
      </Link>

      {/* Categories List */}
      <div className="space-y-1.5 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Không tìm thấy chủ đề</p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const count = getArticleCount(category.slug)
            const hasSubCategories = category.subCategories && category.subCategories.length > 0
            const isExpanded = shouldExpand(category.slug)

            return (
              <div key={category.slug} className="group/item">
                <div className="flex items-stretch gap-1">
                  {/* Expand/Collapse Button */}
                  {hasSubCategories ? (
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="flex-shrink-0 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                      aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                    >
                      <svg
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-300 ${
                          isExpanded ? 'rotate-90 text-brand-500' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-7 flex-shrink-0" />
                  )}
                  
                  {/* Category Link */}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex-1 group/link relative overflow-hidden rounded-lg transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 to-purple-500/0 group-hover/link:from-brand-500/5 group-hover/link:to-purple-500/5 transition-all duration-300"></div>
                    <div className="relative px-3 py-2.5 flex justify-between items-center">
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl flex-shrink-0 group-hover/link:scale-110 transition-transform">
                          {category.icon}
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover/link:text-brand-600 dark:group-hover/link:text-brand-400 transition-colors truncate">
                          {category.name}
                        </span>
                      </span>
                      <span className="flex-shrink-0 ml-2 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700/50 group-hover/link:bg-brand-100 dark:group-hover/link:bg-brand-900/30 text-gray-600 dark:text-gray-400 group-hover/link:text-brand-700 dark:group-hover/link:text-brand-400 rounded-full text-xs font-semibold transition-all">
                        {count}
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Subcategories - Enhanced Design */}
                {hasSubCategories && isExpanded && (
                  <div className="ml-7 mt-1 space-y-0.5 animate-slide-down border-l-2 border-brand-200 dark:border-brand-900/30 pl-3 py-1">
                    {category.subCategories!.map((subCat) => {
                      const subCount = getArticleCount(subCat.slug)
                      const matchesSearch = searchQuery && subCat.name.toLowerCase().includes(searchQuery.toLowerCase())
                      
                      return (
                        <Link
                          key={subCat.slug}
                          href={`/categories/${subCat.slug}`}
                          className={`group/sub block rounded-lg transition-all hover:translate-x-1 ${
                            matchesSearch ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                          }`}
                        >
                          <div className="px-3 py-2 flex justify-between items-center">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className="text-base flex-shrink-0 group-hover/sub:scale-110 transition-transform">
                                {subCat.icon}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover/sub:text-brand-600 dark:group-hover/sub:text-brand-400 font-medium transition-colors truncate">
                                {subCat.name}
                              </span>
                            </span>
                            <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700/30 group-hover/sub:bg-brand-50 dark:group-hover/sub:bg-brand-900/20 text-gray-500 dark:text-gray-500 group-hover/sub:text-brand-600 dark:group-hover/sub:text-brand-400 rounded-full text-xs font-medium transition-all">
                              {subCount}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      
      {/* Category Count Info */}
      {searchQuery && filteredCategories.length > 0 && (
        <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tìm thấy <span className="font-semibold text-brand-600 dark:text-brand-400">{filteredCategories.length}</span> chủ đề
          </p>
        </div>
      )}
    </div>
  )
}
