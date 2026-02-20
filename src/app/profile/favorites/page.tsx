'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiBookmark, HiTrash } from 'react-icons/hi2'
import ArticleCard from '@/components/ArticleCard'
import { ArticleMetadata } from '@/types/article'

interface Favorite {
  id: string
  articleSlug: string
  createdAt: string
}

interface GroupedArticles {
  [category: string]: ArticleMetadata[]
}

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [articles, setArticles] = useState<ArticleMetadata[]>([])
  const [groupedArticles, setGroupedArticles] = useState<GroupedArticles>({})
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [removingSlug, setRemovingSlug] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)

        // Fetch article details
        const articleSlugs = data.favorites.map((f: Favorite) => f.articleSlug)
        await fetchArticleDetails(articleSlugs)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const fetchArticleDetails = async (slugs: string[]) => {
    try {
      // Fetch article metadata from API
      const articlesData = await Promise.all(
        slugs.map(async (slug) => {
          try {
            const response = await fetch(`/api/articles/${slug}`)
            if (response.ok) {
              const data = await response.json()
              return {
                slug,
                title: data.title || slug,
                description: data.description || '',
                category: data.category || 'Uncategorized',
                date: data.date || new Date().toISOString(),
              } as ArticleMetadata
            }
            return null
          } catch {
            return null
          }
        })
      )
      
      const validArticles = articlesData.filter(Boolean) as ArticleMetadata[]
      setArticles(validArticles)
      
      // Group by category
      const grouped = validArticles.reduce((acc, article) => {
        const category = article.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(article)
        return acc
      }, {} as GroupedArticles)
      
      setGroupedArticles(grouped)
    } catch (error) {
      console.error('Failed to fetch article details:', error)
    }
  }

  const handleRemove = async (articleSlug: string) => {
    const favorite = favorites.find(f => f.articleSlug === articleSlug)
    if (!favorite || !confirm('Bạn có chắc muốn xóa bài viết này khỏi danh sách yêu thích?')) return

    setRemovingSlug(articleSlug)

    try {
      const response = await fetch(`/api/favorites?articleSlug=${articleSlug}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Update state
        setFavorites(favorites.filter(f => f.articleSlug !== articleSlug))
        setArticles(articles.filter(a => a.slug !== articleSlug))
        
        // Re-group articles
        const newArticles = articles.filter(a => a.slug !== articleSlug)
        const grouped = newArticles.reduce((acc, article) => {
          const category = article.category
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(article)
          return acc
        }, {} as GroupedArticles)
        setGroupedArticles(grouped)
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    } finally {
      setRemovingSlug(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Quay lại trang cá nhân</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <HiBookmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bài viết yêu thích</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {loadingFavorites ? '...' : `${favorites.length} bài viết`}
              </p>
            </div>
          </div>
        </div>

        {/* Favorites by Category */}
        {loadingFavorites ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <HiBookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có bài viết yêu thích
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn chưa lưu bài viết nào. Hãy khám phá và lưu lại những bài viết hữu ích!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
            >
              Khám phá bài viết
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {categoryArticles.length} bài viết
                    </span>
                  </div>
                </div>

                {/* Articles Grid */}
                <div className={`grid gap-6 ${
                  categoryArticles.length === 1 
                    ? 'grid-cols-1' 
                    : categoryArticles.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {categoryArticles.map((article) => (
                    <div key={article.slug} className="relative group">
                      {/* Delete button overlay */}
                      <button
                        onClick={() => handleRemove(article.slug)}
                        disabled={removingSlug === article.slug}
                        className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                        title="Xóa khỏi yêu thích"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                      
                      {/* Article Card */}
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
