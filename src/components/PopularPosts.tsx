'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PopularPost {
  slug: string
  viewCount: number
  uniqueViews: number
}

interface ArticleMeta {
  slug: string
  title: string
  date: string
  category: string
}

export default function PopularPosts({ limit = 5 }: { limit?: number }) {
  const [popularPosts, setPopularPosts] = useState<(PopularPost & Partial<ArticleMeta>)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        // Fetch popular posts and articles metadata in parallel
        const [popularResponse, articlesResponse] = await Promise.all([
          fetch(`/api/views/popular?limit=${limit}&days=30`),
          fetch('/api/articles')
        ])

        const popularData = await popularResponse.json()
        const articlesData = await articlesResponse.json()
        
        if (popularData.success && popularData.popular && articlesData.success) {
          const allArticles = articlesData.articles
          
          // Merge with article metadata
          const enrichedPosts = popularData.popular.map((post: PopularPost) => {
            const article = allArticles.find((a: ArticleMeta) => a.slug === post.slug)
            return {
              ...post,
              title: article?.title || post.slug,
              date: article?.date,
              category: article?.category,
            }
          }).filter((post: any) => post.title !== post.slug) // Filter out posts without metadata

          setPopularPosts(enrichedPosts)
        }
      } catch (error) {
        console.error('Failed to fetch popular posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [limit])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (popularPosts.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
        Chưa có dữ liệu
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {popularPosts.map((post, index) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-1">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.viewCount.toLocaleString()}
                </span>
                {post.uniqueViews && (
                  <span className="text-gray-400">• {post.uniqueViews.toLocaleString()} unique</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
