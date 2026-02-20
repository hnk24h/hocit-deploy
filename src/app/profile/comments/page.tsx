'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiChatBubbleLeft, HiCalendar } from 'react-icons/hi2'

interface Comment {
  id: string
  content: string
  articleSlug: string
  createdAt: string
  parentId: string | null
}

export default function CommentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchComments()
    }
  }, [user])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        // Filter user's comments
        const userComments = data.comments
          .filter((c: any) => c.userId === user?.id)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setComments(userComments)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
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
      <div className="max-w-4xl mx-auto">
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
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <HiChatBubbleLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bình luận của tôi</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {loadingComments ? '...' : `${comments.length} bình luận`}
              </p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {loadingComments ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <HiChatBubbleLeft className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có bình luận nào
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn chưa viết bình luận nào. Hãy tham gia thảo luận!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
            >
              Khám phá bài viết
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <HiCalendar className="w-4 h-4" />
                  <span>{formatDate(comment.createdAt)}</span>
                  {comment.parentId && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 dark:text-blue-400">Trả lời bình luận</span>
                    </>
                  )}
                </div>

                <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                  {comment.content}
                </p>

                <Link
                  href={`/hoc-it/${comment.articleSlug}`}
                  className="inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Xem bài viết</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
