'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamic import to avoid SSR issues with react-pdf
const PDFReader = dynamic(() => import('@/components/PDFReader'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-gray-500 dark:text-gray-400">Loading PDF reader...</div>
    </div>
  ),
})

const ExcelViewer = dynamic(() => import('@/components/ExcelViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-gray-500 dark:text-gray-400">Loading Excel viewer...</div>
    </div>
  ),
})

function ReaderContent() {
  const searchParams = useSearchParams()
  const file = searchParams.get('file')
  const [externalUrl, setExternalUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(file || '')

  // Extract file name from URL
  const getFileName = (url: string): string => {
    if (!url) return ''
    
    // Google Sheets
    if (url.includes('docs.google.com/spreadsheets')) {
      return 'Google Sheets Document'
    }
    
    // Extract from path
    const parts = url.split('/')
    const filename = parts[parts.length - 1].split('?')[0]
    return decodeURIComponent(filename) || 'Document'
  }

  const fileName = getFileName(pdfUrl)

  // Detect file type
  const getFileType = (url: string): 'pdf' | 'excel' | 'unknown' => {
    const lowercaseUrl = url.toLowerCase()
    
    // Google Sheets detection
    if (lowercaseUrl.includes('docs.google.com/spreadsheets')) return 'excel'
    
    // File extension detection
    if (lowercaseUrl.endsWith('.pdf')) return 'pdf'
    if (lowercaseUrl.endsWith('.xlsx') || lowercaseUrl.endsWith('.xls')) return 'excel'
    if (lowercaseUrl.includes('.pdf')) return 'pdf'
    if (lowercaseUrl.includes('.xlsx') || lowercaseUrl.includes('.xls')) return 'excel'
    
    return 'unknown'
  }

  const fileType = getFileType(pdfUrl)
  
  console.log('Reader Debug:', {
    pdfUrl,
    fileType,
    searchParams: file,
  })

  const handleLoadExternalPdf = () => {
    if (externalUrl) {
      let processedUrl = externalUrl.trim()
      
      // Auto-convert OneDrive share link to embed link
      if (processedUrl.includes('onedrive.live.com') || processedUrl.includes('1drv.ms')) {
        // Extract the file ID and convert to embed URL
        if (processedUrl.includes('?')) {
          processedUrl = processedUrl.split('?')[0] + '?download=1'
        }
      }
      
      // Auto-convert Google Drive share link to direct link
      if (processedUrl.includes('drive.google.com/file/d/')) {
        const match = processedUrl.match(/\/file\/d\/([^\/]+)/)
        if (match && match[1]) {
          processedUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`
        }
      }
      
      setPdfUrl(processedUrl)
      setShowUrlInput(false)
    }
  }

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="text-center max-w-3xl w-full">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Document Reader
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
            Đọc PDF và Excel ngay trên trình duyệt
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Local Files */}
            <Link
              href="/library"
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Thư viện Documents
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  PDF & Excel từ thư viện của bạn
                </p>
              </div>
            </Link>

            {/* External URL */}
            <button
              onClick={() => setShowUrlInput(true)}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  Mở từ URL
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  PDF/Excel/Google Sheets từ OneDrive, Google Drive, hoặc link trực tiếp
                </p>
              </div>
            </button>
          </div>

          {/* URL Input Form */}
          {showUrlInput && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Nhập URL tài liệu
                </h3>
                <button
                  onClick={() => {
                    setShowUrlInput(false)
                    setExternalUrl('')
                  }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL của PDF, Excel hoặc Google Sheets
                  </label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleLoadExternalPdf}
                    disabled={!externalUrl}
                    className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md"
                  >
                    Mở tài liệu
                  </button>
                  <button
                    onClick={() => {
                      setShowUrlInput(false)
                      setExternalUrl('')
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Hủy
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Support: PDF (.pdf), Excel (.xlsx, .xls), và Google Sheets</span>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-yellow-900 dark:text-yellow-100 text-xs font-semibold mb-1">
                          Google Sheets: Cần "Publish to web"
                        </p>
                        <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                          File → Share → Publish to web → Publish (để tránh lỗi CORS)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Files */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Hoặc thử với file mẫu:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/reader?file=/pdfs/sample.pdf"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                📄 PDF mẫu
              </Link>
              <Link
                href="/reader?file=/pdfs/sample.xlsx"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                📊 Excel mẫu
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render appropriate viewer based on file type
  if (fileType === 'excel') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* File Info Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/library"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                title="Back to Library"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {fileName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📊 Excel Spreadsheet
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/reader"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Open New</span>
              </Link>
            </div>
          </div>
        </div>
        <ExcelViewer fileUrl={pdfUrl} />
      </div>
    )
  } else if (fileType === 'pdf') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* File Info Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/library"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                title="Back to Library"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {fileName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📄 PDF Document
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/reader"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Open New</span>
              </Link>
            </div>
          </div>
        </div>
        <PDFReader fileUrl={pdfUrl} />
      </div>
    )
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            File type không được hỗ trợ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Chỉ hỗ trợ file PDF (.pdf) và Excel (.xlsx, .xls)
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              href="/reader"
              className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
            >
              Chọn file khác
            </Link>
            <Link
              href="/library"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Về thư viện
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading document...</p>
          </div>
        </div>
      </div>
    }>
      <ReaderContent />
    </Suspense>
  )
}
