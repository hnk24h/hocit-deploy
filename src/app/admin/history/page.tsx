'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Change {
  timestamp: string
  date: string
  action: string
  details: any
}

interface Analytics {
  date: string
  creates: number
  updates: number
  deletes: number
  total: number
}

export default function AdminHistoryPage() {
  const [historyFiles, setHistoryFiles] = useState<string[]>([])
  const [recentChanges, setRecentChanges] = useState<Change[]>([])
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [backupData, setBackupData] = useState<any>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/admin/history')
      const data = await response.json()

      if (response.ok) {
        setHistoryFiles(data.historyFiles)
        setRecentChanges(data.recentChanges)
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBackup = async (date: string) => {
    try {
      setSelectedDate(date)
      setBackupData(null)
      
      const response = await fetch(`/api/admin/history/${date}`)
      const data = await response.json()

      if (response.ok) {
        setBackupData(data)
      }
    } catch (error) {
      console.error('Error loading backup:', error)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE_PRODUCT': return '➕'
      case 'UPDATE_PRODUCT': return '✏️'
      case 'DELETE_PRODUCT': return '🗑️'
      default: return '📝'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_PRODUCT': return 'text-green-600 dark:text-green-400'
      case 'UPDATE_PRODUCT': return 'text-blue-600 dark:text-blue-400'
      case 'DELETE_PRODUCT': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin"
            className="text-brand-600 dark:text-brand-400 hover:underline mb-2 inline-block"
          >
            ← Quay lại Admin
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            📊 Lịch sử & Phân tích
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Xem lịch sử thay đổi và backup theo ngày
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Analytics Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card p-6">
                <div className="text-3xl mb-2">📁</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {historyFiles.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Backup files
                </div>
              </div>

              <div className="card p-6">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recentChanges.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Thay đổi gần đây
                </div>
              </div>

              <div className="card p-6">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ngày có hoạt động
                </div>
              </div>
            </div>

            {/* Activity by Date */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📊 Hoạt động theo ngày
              </h2>
              <div className="space-y-3">
                {analytics.slice(0, 7).map((item) => (
                  <div key={item.date} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.date}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.total} thay đổi
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">➕</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.creates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">✏️</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-red-600">🗑️</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.deletes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Changes */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🕐 Thay đổi gần đây
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {recentChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-button"
                  >
                    <span className="text-2xl">{getActionIcon(change.action)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`font-semibold ${getActionColor(change.action)}`}>
                            {change.action.replace('_', ' ')}
                          </span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {change.details.name} ({change.details.category})
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(change.timestamp).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Backups List */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                💾 Backup Files
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {historyFiles.map((file) => {
                  const date = file.replace('.json', '')
                  const isSelected = selectedDate === date
                  return (
                    <button
                      key={file}
                      onClick={() => loadBackup(date)}
                      className={`w-full text-left p-3 rounded-button transition-all ${
                        isSelected
                          ? 'bg-brand-100 dark:bg-brand-900 border-2 border-brand-500'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {date}
                        </span>
                        {isSelected && (
                          <span className="text-brand-600 dark:text-brand-400">✓</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Backup Preview */}
            {backupData && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  📄 Chi tiết Backup
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {backupData.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sản phẩm:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {backupData.productCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Deals:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {backupData.dealsCount}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Tính năng restore sẽ được thêm sau
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
