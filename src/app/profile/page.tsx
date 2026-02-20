'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiUserCircle, HiChatBubbleLeft, HiBookmark, HiCalendar, HiEnvelope } from 'react-icons/hi2'

interface UserStats {
  commentsCount: number
  favoritesCount: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats>({ commentsCount: 0, favoritesCount: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const [commentsRes, favoritesRes] = await Promise.all([
        fetch('/api/comments', { credentials: 'include' }),
        fetch('/api/favorites', { credentials: 'include' })
      ])

      if (commentsRes.ok && favoritesRes.ok) {
        const commentsData = await commentsRes.json()
        const favoritesData = await favoritesRes.json()

        // Filter user's comments
        const userComments = commentsData.comments.filter((c: any) => c.userId === user?.id)

        setStats({
          commentsCount: userComments.length,
          favoritesCount: favoritesData.favorites.length
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-3xl font-bold">
                {(user.name || user.username).charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name || user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">@{user.username}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <HiEnvelope className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-4 h-4" />
                  <span>Tham gia {joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Link
            href="/profile/comments"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <HiChatBubbleLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bình luận</p>
                {loadingStats ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.commentsCount}</p>
                )}
              </div>
            </div>
          </Link>

          <Link
            href="/profile/favorites"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <HiBookmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bài viết yêu thích</p>
                {loadingStats ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.favoritesCount}</p>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Truy cập nhanh</h2>
          <div className="space-y-3">
            <Link
              href="/profile/comments"
              className="block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HiChatBubbleLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">Bình luận của tôi</span>
              </div>
            </Link>

            <Link
              href="/profile/favorites"
              className="block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HiBookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">Bài viết yêu thích</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
