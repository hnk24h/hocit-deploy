'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiBookOpen } from 'react-icons/hi2'

interface PDFBook {
  title: string
  filename: string
  description?: string
  author?: string
  pages?: number
  thumbnail?: string
  type?: 'pdf' | 'excel'
}

export default function LibraryPage() {
  const [books, setBooks] = useState<PDFBook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddUrl, setShowAddUrl] = useState(false)
  const [newBookUrl, setNewBookUrl] = useState('')
  const [newBookTitle, setNewBookTitle] = useState('')

  // Load library from API
  useEffect(() => {
    loadLibrary()
  }, [])

  const loadLibrary = async () => {
    try {
      const response = await fetch('/api/library')
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Failed to load library:', error)
      // Fallback to empty array
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddExternalBook = async () => {
    if (newBookUrl && newBookTitle) {
      try {
        const response = await fetch('/api/library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newBookTitle,
            filename: newBookUrl,
            description: 'External file',
            type: newBookUrl.toLowerCase().includes('.xlsx') || newBookUrl.includes('spreadsheet') ? 'excel' : 'pdf'
          })
        })

        const result = await response.json()
        
        if (response.ok) {
          // Reload library
          await loadLibrary()
          setNewBookUrl('')
          setNewBookTitle('')
          setShowAddUrl(false)
        } else if (result.exists) {
          alert('⚠️ File này đã có trong thư viện')
        } else {
          alert('❌ Lỗi: ' + result.error)
        }
      } catch (error) {
        console.error('Failed to add book:', error)
        alert('❌ Không thể thêm file vào thư viện')
      }
    }
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <HiBookOpen className="w-8 h-8" />
              <span>Thư viện tài liệu</span>
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddUrl(!showAddUrl)}
                className="px-4 py-2 text-sm sm:text-base bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                + URL
              </button>
              <Link
                href="/"
                className="px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                ← Trang chủ
              </Link>
            </div>
          </div>

          {/* Add External URL Form */}
          {showAddUrl && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Thêm tài liệu từ URL
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="Tên tài liệu"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
                />
                <input
                  type="url"
                  value={newBookUrl}
                  onChange={(e) => setNewBookUrl(e.target.value)}
                  placeholder="https://... (PDF, Excel, Google Sheets)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddExternalBook}
                    disabled={!newBookTitle || !newBookUrl}
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Thêm vào thư viện
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUrl(false)
                      setNewBookUrl('')
                      setNewBookTitle('')
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sách theo tên hoặc tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 pl-10 sm:pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Books Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Đang tải thư viện...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? 'Không tìm thấy tài liệu phù hợp.' : 'Thư viện chưa có tài liệu.'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Thêm file PDF hoặc Excel vào folder <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">public/pdfs/</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredBooks.map((book) => {
              const isExternalUrl = book.filename.startsWith('http://') || book.filename.startsWith('https://')
              const readerUrl = isExternalUrl 
                ? `/reader?file=${encodeURIComponent(book.filename)}`
                : `/reader?file=/pdfs/${book.filename}`
              
              // Detect file type
              const fileType = book.type || (book.filename.toLowerCase().endsWith('.xlsx') || book.filename.toLowerCase().endsWith('.xls') ? 'excel' : 'pdf')
              
              return (
                <Link
                  key={book.filename}
                  href={readerUrl}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                {/* Thumbnail */}
                <div className={`aspect-[3/4] ${fileType === 'excel' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-brand-400 to-blue-500'} flex items-center justify-center`}>
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : fileType === 'excel' ? (
                    // Excel icon
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ) : (
                    // PDF/Book icon
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                      {book.author}
                    </p>
                  )}
                  {book.description && (
                    <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  {book.pages && (
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                      {book.pages} trang
                    </p>
                  )}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {/* File type badge */}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      fileType === 'excel' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {fileType === 'excel' ? '📊 Excel' : '📄 PDF'}
                    </span>
                    {/* External URL badge */}
                    {isExternalUrl && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-700 dark:text-blue-300">
                        🌐 External
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </main>

      {/* Upload Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
            💡 Cách thêm tài liệu
          </h3>
          <ol className="list-decimal list-inside text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>Thêm file PDF hoặc Excel (.xlsx, .xls) vào folder <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">public/pdfs/</code></li>
            <li>Cập nhật danh sách tài liệu trong <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">src/app/library/page.tsx</code></li>
            <li>Hoặc click nút <strong>"+ URL"</strong> để thêm từ OneDrive/Google Drive/Google Sheets</li>
            <li>Hoặc tạo API để load tài liệu tự động từ folder</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
