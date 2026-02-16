'use client'

import { useEffect, useState } from 'react'

interface ViewCountProps {
  slug: string
  className?: string
  showIcon?: boolean
}

export default function ViewCount({ slug, className = '', showIcon = true }: ViewCountProps) {
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchViewCount() {
      try {
        const response = await fetch(`/api/views/${slug}`)
        const data = await response.json()
        setViewCount(data.viewCount || 0)
      } catch (error) {
        console.error('Failed to fetch view count:', error)
        setViewCount(0)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchViewCount()
    }
  }, [slug])

  if (loading) {
    return (
      <span className={`text-gray-500 dark:text-gray-400 text-sm ${className}`}>
        {showIcon && '👁️ '}
        <span className="opacity-50">---</span>
      </span>
    )
  }

  return (
    <span className={`text-gray-500 dark:text-gray-400 text-sm ${className}`}>
      {showIcon && '👁️ '}
      {viewCount !== null ? viewCount.toLocaleString() : '0'} lượt xem
    </span>
  )
}
