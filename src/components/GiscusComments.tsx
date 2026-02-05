'use client'

import Giscus from '@giscus/react'
import { useEffect, useState } from 'react'

interface GiscusCommentsProps {
  slug: string
  title: string
  enabled?: boolean
}

export default function GiscusComments({ slug, title, enabled = true }: GiscusCommentsProps) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check for dark mode
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  if (!enabled) {
    return null
  }

  // Get configuration from environment variables
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  // Don't render if Giscus is not configured
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Comments are not configured. Please set up Giscus in your environment variables.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Bình luận</h2>
      <Giscus
        id="comments"
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="vi"
        loading="lazy"
      />
    </div>
  )
}
