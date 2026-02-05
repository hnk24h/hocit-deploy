'use client'

import { useEffect } from 'react'

export default function PrismLoader() {
  useEffect(() => {
    // Dynamically load Prism for client-side highlighting
    const loadPrism = async () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore - Dynamic imports for Prism components
        const Prism = (await import('prismjs')).default
        
        // Load languages
        // @ts-ignore
        await import('prismjs/components/prism-javascript')
        // @ts-ignore
        await import('prismjs/components/prism-typescript')
        // @ts-ignore
        await import('prismjs/components/prism-jsx')
        // @ts-ignore
        await import('prismjs/components/prism-tsx')
        // @ts-ignore
        await import('prismjs/components/prism-bash')
        // @ts-ignore
        await import('prismjs/components/prism-sql')
        // @ts-ignore
        await import('prismjs/components/prism-json')
        // @ts-ignore
        await import('prismjs/components/prism-markdown')
        
        // Highlight all code blocks
        Prism.highlightAll()
      }
    }
    
    loadPrism()
  }, [])

  return null
}
