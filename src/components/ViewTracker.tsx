'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ViewTrackerProps {
  slug: string
  enabled?: boolean
}

export default function ViewTracker({ slug, enabled = true }: ViewTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (!enabled || !slug) return

    // Track view after a delay (to avoid bots and quick bounces)
    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/views/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname || `/blog/${slug}`,
          }),
        })
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }, 3000) // Track after 3 seconds

    return () => clearTimeout(timer)
  }, [slug, pathname, enabled])

  return null // This component doesn't render anything
}
