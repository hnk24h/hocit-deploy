'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2'

interface FavoriteButtonProps {
  articleSlug: string
  className?: string
}

export default function FavoriteButton({ articleSlug, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (user) {
      checkFavorite()
    } else {
      setLoading(false)
    }
  }, [user, articleSlug])

  const checkFavorite = async () => {
    try {
      const response = await fetch('/api/favorites', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        const favorited = data.favorites.some((f: any) => f.articleSlug === articleSlug)
        setIsFavorited(favorited)
      }
    } catch (error) {
      console.error('Failed to check favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setProcessing(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?articleSlug=${articleSlug}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          setIsFavorited(false)
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleSlug }),
          credentials: 'include'
        })

        if (response.ok) {
          setIsFavorited(true)
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg ${className}`}
      >
        <HiOutlineBookmark className="w-5 h-5 animate-pulse" />
        <span className="text-sm">...</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={processing}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
        isFavorited
          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 hover:bg-brand-200 dark:hover:bg-brand-900/50'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${className}`}
      title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      {isFavorited ? (
        <HiBookmark className="w-5 h-5" />
      ) : (
        <HiOutlineBookmark className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">
        {isFavorited ? 'Đã lưu' : 'Lưu bài'}
      </span>
    </button>
  )
}
