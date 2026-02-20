'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MarkdownEditor from '@/components/MarkdownEditor'
import Link from 'next/link'
import { marked } from 'marked'

function EditorContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
  })
  const [content, setContent] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [categories, setCategories] = useState<Array<{ slug: string; name: string; icon: string }>>([])
  const [autoSlug, setAutoSlug] = useState(true) // Track if slug should auto-generate
  const [previewMode, setPreviewMode] = useState(false) // Toggle between markdown and HTML preview
  const [previewHtml, setPreviewHtml] = useState('')
  const [isProduction, setIsProduction] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Check if running in production
  useEffect(() => {
    setIsProduction(process.env.NODE_ENV === 'production' || !window.location.hostname.includes('localhost'))
  }, [])

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load existing post if slug is provided
  useEffect(() => {
    if (slug) {
      loadPost(slug)
    }
  }, [slug])

  // Count words in markdown (excluding code blocks and special syntax)
  const countWords = (text: string): number => {
    if (!text) return 0
    // Remove code blocks
    const withoutCodeBlocks = text.replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, '')
    // Remove markdown links but keep text
    const withoutLinks = withoutInlineCode.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown formatting
    const withoutFormatting = withoutLinks.replace(/[#*_~`>|-]/g, '')
    // Count words (split by whitespace)
    const words = withoutFormatting.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
  }

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize Vietnamese characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove duplicate hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories', {
        credentials: 'include'
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  // Update preview HTML and word count when markdown changes
  useEffect(() => {
    if (markdown && previewMode) {
      const html = marked.parse(markdown) as string
      setPreviewHtml(html)
    }
    // Update word count
    setWordCount(countWords(markdown))
  }, [markdown, previewMode])

  const handlePreview = () => {
    if (!previewMode && markdown) {
      const html = marked.parse(markdown) as string
      setPreviewHtml(html)
    }
    setPreviewMode(!previewMode)
  }

  const loadPost = async (slug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/load?slug=${slug}`)
      const data = await response.json()

      if (response.ok) {
        const post = data.post
        setFormData({
          title: post.title,
          slug: post.slug,
          date: post.date,
          category: post.category,
          description: post.description,
        })
        
        // Disable auto-slug when editing existing post
        setAutoSlug(false)
        
        // Convert markdown to HTML for editor display
        const html = marked.parse(post.content) as string
        setContent(html)
        setMarkdown(post.content)
        setMessage({ type: 'success', text: '✅ Bài viết đã được tải thành công' })
      } else {
        setMessage({ type: 'error', text: `❌ ${data.error || 'Không thể tải bài viết'}` })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ type: 'error', text: `❌ Lỗi mạng: ${errorMsg}` })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validate
    if (!formData.title) {
      setMessage({ type: 'error', text: '❌ Vui lòng nhập tiêu đề bài viết' })
      return
    }
    if (!formData.slug) {
      setMessage({ type: 'error', text: '❌ Slug không được để trống (tự động tạo từ tiêu đề)' })
      return
    }
    if (!formData.category) {
      setMessage({ type: 'error', text: '❌ Vui lòng chọn danh mục' })
      return
    }
    if (!formData.description) {
      setMessage({ type: 'error', text: '❌ Vui lòng nhập mô tả bài viết' })
      return
    }
    if (!markdown || markdown.trim() === '') {
      setMessage({ type: 'error', text: '❌ Nội dung bài viết không được để trống' })
      return
    }

    // Word count validation
    const words = countWords(markdown)
    if (words < 800) {
      setMessage({ 
        type: 'error', 
        text: `❌ Bài viết quá ngắn! Hiện tại: ${words} từ. Yêu cầu tối thiểu: 800-1,000 từ để đạt chuẩn SEO và Google AdSense.` 
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/posts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: markdown,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        const articleUrl = `/articles/${data.slug}`
        setMessage({ 
          type: 'success', 
          text: `✅ Đã lưu thành công: ${data.slug}.md. Đang mở bài viết...` 
        })
        // Keep autoSlug disabled after first save
        setAutoSlug(false)
        // Open article in new tab
        setTimeout(() => {
          window.open(articleUrl, '_blank')
        }, 500)
      } else {
        // Show specific error from API
        const errorDetail = data.details ? ` (Chi tiết: ${data.details})` : ''
        setMessage({ 
          type: 'error', 
          text: `❌ ${data.error || 'Lỗi khi lưu bài viết'}${errorDetail}` 
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi mạng: Không thể kết nối đến server. ${errorMsg}` 
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    // Check if post is saved
    if (!formData.slug || !formData.title) {
      setMessage({ 
        type: 'error', 
        text: '❌ Vui lòng lưu bài viết trước khi publish' 
      })
      return
    }

    const confirmed = confirm(
      `🚀 Publish bài viết "${formData.title}"?\n\n` +
      `Bài viết sẽ được:\n` +
      `1. Commit vào git\n` +
      `2. Push lên GitHub\n` +
      `3. Deploy lên Vercel\n\n` +
      `Bạn có chắc chắn muốn tiếp tục?`
    )

    if (!confirmed) return

    setPublishing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: formData.slug,
          title: formData.title,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `🚀 Đã publish thành công! Bài viết "${formData.title}" đang được deploy lên Vercel.` 
        })
      } else {
        const errorDetail = data.details ? `\n\nChi tiết: ${data.details}` : ''
        const stderr = data.stderr ? `\n\nError log: ${data.stderr}` : ''
        setMessage({ 
          type: 'error', 
          text: `❌ ${data.error || 'Lỗi khi publish'}${errorDetail}${stderr}` 
        })
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ 
        type: 'error', 
        text: `❌ Lỗi mạng: Không thể kết nối đến server. ${errorMsg}` 
      })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                ← Back to Blog
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {slug ? 'Edit Post' : 'New Post'}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                {previewMode ? '📝 Markdown' : '👁️ Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={loading || publishing || isProduction}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                title={isProduction ? 'Editor only works in localhost' : 'Save post to local file'}
              >
                {loading ? 'Saving...' : '💾 Save Post'}
              </button>
              <button
                onClick={handlePublish}
                disabled={loading || publishing || !formData.slug || isProduction}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-lg"
                title={isProduction ? 'Publish only works in localhost' : !formData.slug ? 'Save the post first before publishing' : 'Deploy to production'}
              >
                {publishing ? '🚀 Publishing...' : '🚀 Publish'}
              </button>
            </div>
          </div>

          {/* Production Warning */}
          {isProduction && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                    Editor chỉ hoạt động ở Local Development
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Để tạo và publish bài viết, vui lòng:
                  </p>
                  <ol className="text-sm text-yellow-700 dark:text-yellow-400 mt-2 ml-4 list-decimal space-y-1">
                    <li>Chạy <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">npm run dev</code> ở localhost</li>
                    <li>Truy cập <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">http://localhost:3000/editor</code></li>
                    <li>Tạo và save bài viết</li>
                    <li>Click nút <strong>🚀 Publish</strong> để deploy lên production</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Frontmatter Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Frontmatter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value
                  setFormData({ 
                    ...formData, 
                    title: newTitle,
                    // Auto-generate slug if enabled
                    ...(autoSlug && { slug: generateSlug(newTitle) })
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Tiêu đề bài viết"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug * {autoSlug && <span className="text-xs text-gray-500">(tự động từ tiêu đề)</span>}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value })
                  // Disable auto-slug when user manually edits
                  if (autoSlug) setAutoSlug(false)
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="post-slug"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                URL: /articles/{formData.slug || 'slug'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category * <span className="text-xs text-gray-500">(chọn hoặc nhập mới)</span>
              </label>
              <input
                type="text"
                list="categories-list"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Chọn hoặc gõ tên danh mục..."
              />
              <datalist id="categories-list">
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </datalist>
              {categories.length === 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ Chưa có danh mục. Bạn có thể nhập tên danh mục mới.
                </p>
              )}
              {categories.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Danh mục có sẵn: {categories.map(c => c.slug).join(', ')}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Brief description for SEO"
              />
            </div>
          </div>
        </div>

        {/* Word Count Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Số từ:</span>
                <span className={`ml-2 text-2xl font-bold ${
                  wordCount < 800 ? 'text-red-600 dark:text-red-400' :
                  wordCount >= 800 && wordCount < 1000 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {wordCount.toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                {wordCount < 800 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Cần thêm {800 - wordCount} từ nữa (tối thiểu 800 từ)
                    </span>
                  </div>
                ) : wordCount >= 800 && wordCount < 1000 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                      Đạt tối thiểu! Khuyến nghị: 1,000 từ
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Tuyệt vời! Đạt chuẩn SEO & AdSense
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">800+</div>
                <div>Tối thiểu</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600 dark:text-green-400">1,000+</div>
                <div>Khuyến nghị</div>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  wordCount < 800 ? 'bg-red-500' :
                  wordCount >= 800 && wordCount < 1000 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min((wordCount / 1000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: WYSIWYG Editor */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Editor</h2>
            <MarkdownEditor content={content} onChange={setMarkdown} />
          </div>

          {/* Right: Preview */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {previewMode ? '👁️ Preview (HTML Render)' : '📝 Markdown Output'}
            </h2>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-6 min-h-[500px] max-h-[700px] overflow-auto">
              {previewMode ? (
                <article 
                  className="prose prose-slate dark:prose-invert max-w-none
                    prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:text-gray-100
                    prose-img:rounded-lg prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-400">Start typing to see preview...</p>' }}
                />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                  {markdown || 'Start typing to see markdown output...'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EditorContent />
    </Suspense>
  )
}
