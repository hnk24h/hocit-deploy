'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { HiChatBubbleLeftRight, HiPaperAirplane, HiCheckCircle, HiClock } from 'react-icons/hi2'

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  parentId: string | null
  replies?: Comment[]
  pending?: boolean // Local flag for unmoderated comments
}

interface CommentsProps {
  articleSlug: string
}

export default function Comments({ articleSlug }: CommentsProps) {
  const { user } = useAuth() // Get logged-in user
  const [comments, setComments] = useState<Comment[]>([])
  const [pendingComments, setPendingComments] = useState<Comment[]>([]) // User's pending comments
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch comments
  useEffect(() => {
    fetchComments()
  }, [articleSlug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleSlug=${articleSlug}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        // Build comment tree from flat list
        const commentTree = buildCommentTree(data)
        setComments(commentTree)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Build nested comment tree from flat list
  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: build tree structure
    flatComments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!
      if (comment.parentId) {
        // This is a reply, add to parent's replies
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(commentNode)
        }
      } else {
        // This is a root comment
        rootComments.push(commentNode)
      }
    })

    return rootComments
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Only validate author/email for guest users
    if (!user) {
      if (!formData.author.trim() || formData.author.length < 2) {
        newErrors.author = 'Tên phải có ít nhất 2 ký tự'
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ'
      }
    }

    // Always validate content
    if (!formData.content.trim() || formData.content.length < 10) {
      newErrors.content = 'Bình luận phải có ít nhất 10 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          ...formData,
          parentId: replyTo,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Reset form
        setFormData({ author: '', email: '', content: '' })
        setShowForm(false)
        setReplyTo(null)
        
        // Reload comments to show new comment immediately (auto-approved)
        await fetchComments()
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } else {
        console.error('Comment submission failed:', data)
        setErrors({ submit: data.error || 'Có lỗi xảy ra' })
      }
    } catch (error) {
      console.error('Comment submission error:', error)
      setErrors({ submit: 'Không thể gửi bình luận. Vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isReply = depth > 0
    const maxDepth = 5 // Maximum nesting level
    const indentClass = depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''
    
    return (
    <div className={`${indentClass} ${isReply ? 'mt-4' : ''}`}>
      <div className={`rounded-lg p-4 ${
        comment.pending 
          ? 'bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800' 
          : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                {comment.pending && (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-2 py-0.5 rounded-full">
                    <HiClock className="w-3 h-3" />
                    Đang chờ duyệt
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {comment.content}
        </p>

        {depth < maxDepth && (
          <button
            onClick={() => {
              setReplyTo(comment.id)
              setShowForm(true)
            }}
            className="mt-3 text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >
            Trả lời
          </button>
        )}
      </div>

      {/* Nested replies - Recursive rendering */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
    )
  }

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HiChatBubbleLeftRight className="w-7 h-7" />
          <span>Thảo luận ({comments.length + pendingComments.length})</span>
        </h2>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Viết bình luận
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800 dark:text-green-200">
            <strong>Thành công!</strong> Bình luận của bạn đã được đăng.
          </div>
        </div>
      )}

      {/* Comment Form */}
      {showForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {replyTo ? 'Trả lời bình luận' : 'Viết bình luận mới'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                setReplyTo(null)
                setFormData({ author: '', email: '', content: '' })
                setErrors({})
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Info or Guest Fields */}
            {user ? (
              // Logged-in user info
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                    {(user.name || user.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>
            ) : (
              // Guest fields
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên của bạn *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="email@example.com"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email không được hiển thị công khai
                    </p>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                {/* Login suggestion for guests */}
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  💡 <Link href="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Đăng nhập</Link> hoặc <Link href="/register" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">tạo tài khoản</Link> để comment nhanh hơn!
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nội dung *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Chia sẻ suy nghĩ của bạn..."
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tối thiểu 10 ký tự
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.content.length}/2000
                </p>
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
              )}
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiPaperAirplane className="w-4 h-4" />
                {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setReplyTo(null)
                  setFormData({ author: '', email: '', content: '' })
                  setErrors({})
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải bình luận...</p>
        </div>
      ) : comments.length === 0 && pendingComments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <HiChatBubbleLeftRight className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              Viết bình luận đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Show pending comments first (yellow background) */}
          {pendingComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} depth={0} />
          ))}
          
          {/* Then show approved comments (already in tree structure) */}
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} depth={0} />
          ))}
        </div>
      )}
    </div>
  )
}
