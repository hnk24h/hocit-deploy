'use client'

import { useState, useEffect } from 'react'
import { HiCheckCircle, HiXCircle, HiChatBubbleLeftRight, HiArrowPath, HiCalendar, HiUser, HiEnvelope } from 'react-icons/hi2'

interface PendingComment {
  id: string
  articleSlug: string
  author: string
  email: string
  content: string
  createdAt: string
  parentId: string | null
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<PendingComment[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPendingComments()
  }, [])

  const loadPendingComments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setError('Cần đăng nhập admin')
        setLoading(false)
        return
      }

      const response = await fetch('/api/comments/moderate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else if (response.status === 401) {
        setError('Token không hợp lệ. Vui lòng đăng nhập lại.')
      } else {
        setError('Không thể tải danh sách comments')
      }
    } catch (err) {
      setError('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async (commentId: string, approved: boolean) => {
    setProcessing(commentId)
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/comments/moderate', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ commentId, approved })
      })

      if (response.ok) {
        // Remove from list
        setComments(prev => prev.filter(c => c.id !== commentId))
        setSelectedIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(commentId)
          return newSet
        })
      } else {
        alert('Có lỗi xảy ra khi xử lý comment')
      }
    } catch (err) {
      alert('Lỗi kết nối server')
    } finally {
      setProcessing(null)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return
    
    setProcessing('bulk')
    const token = localStorage.getItem('adminToken')
    
    for (const id of Array.from(selectedIds)) {
      try {
        await fetch('/api/comments/moderate', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ commentId: id, approved: true })
        })
      } catch (err) {
        console.error('Error approving:', id, err)
      }
    }
    
    setProcessing(null)
    setSelectedIds(new Set())
    await loadPendingComments()
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    
    if (!confirm(`Xóa ${selectedIds.size} comments đã chọn?`)) return
    
    setProcessing('bulk')
    const token = localStorage.getItem('adminToken')
    
    for (const id of Array.from(selectedIds)) {
      try {
        await fetch(`/api/comments?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Error deleting:', id, err)
      }
    }
    
    setProcessing(null)
    setSelectedIds(new Set())
    await loadPendingComments()
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(comments.map(c => c.id)))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <button
            onClick={() => window.location.href = '/admin'}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Về trang admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <HiChatBubbleLeftRight className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quản lý Comments
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {comments.length} comments đang chờ duyệt
              </p>
            </div>
          </div>

          <button
            onClick={loadPendingComments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Đã chọn {selectedIds.size} comments
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkApprove}
                  disabled={processing === 'bulk'}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <HiCheckCircle className="w-5 h-5" />
                  Duyệt tất cả
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={processing === 'bulk'}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <HiXCircle className="w-5 h-5" />
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
            <HiCheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tuyệt vời! Không có comments nào cần duyệt
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tất cả comments đã được xử lý
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === comments.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  Chọn tất cả
                </span>
              </label>
            </div>

            {/* Comment Cards */}
            {comments.map(comment => (
              <div
                key={comment.id}
                className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-colors ${
                  selectedIds.has(comment.id)
                    ? 'border-blue-500 dark:border-blue-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="p-6">
                  {/* Checkbox & Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(comment.id)}
                      onChange={() => toggleSelect(comment.id)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-1">
                      {/* Article Link */}
                      <a
                        href={`/articles/${comment.articleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 inline-block"
                      >
                        📄 {comment.articleSlug}
                      </a>

                      {/* Author Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <HiUser className="w-4 h-4" />
                          <span className="font-medium">{comment.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiEnvelope className="w-4 h-4" />
                          <span>{comment.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiCalendar className="w-4 h-4" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        {comment.parentId && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
                            💬 Reply
                          </span>
                        )}
                      </div>

                      {/* Comment Content */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleModerate(comment.id, true)}
                          disabled={processing === comment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiCheckCircle className="w-4 h-4" />
                          {processing === comment.id ? 'Đang xử lý...' : 'Duyệt'}
                        </button>
                        
                        <button
                          onClick={() => handleModerate(comment.id, false)}
                          disabled={processing === comment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiXCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
