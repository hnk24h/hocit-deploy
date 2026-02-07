'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// Configure PDF.js worker for version 3.x
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
}

interface PDFReaderProps {
  fileUrl: string
}

export default function PDFReader({ fileUrl }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const [showControls, setShowControls] = useState(true)
  const [error, setError] = useState<string>('')

  // Check if URL is external
  const isExternalUrl = fileUrl.startsWith('http://') || fileUrl.startsWith('https://')
  
  // Use proxy for external URLs to bypass CORS
  const processedFileUrl = isExternalUrl 
    ? `/api/proxy?url=${encodeURIComponent(fileUrl)}`
    : fileUrl

  // Configure PDF.js options
  const pdfOptions = {
    withCredentials: false,
    httpHeaders: {},
  }

  // Auto-detect screen size for initial scale
  useEffect(() => {
    const updatePageWidth = () => {
      const width = window.innerWidth
      if (width < 640) {
        // Mobile
        setPageWidth(width - 32)
        setScale(0.8)
      } else if (width < 1024) {
        // Tablet
        setPageWidth(width - 64)
        setScale(1.0)
      } else {
        // Desktop
        setPageWidth(800)
        setScale(1.2)
      }
    }

    updatePageWidth()
    window.addEventListener('resize', updatePageWidth)
    return () => window.removeEventListener('resize', updatePageWidth)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage()
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goToNextPage()
      } else if (e.key === '+' || e.key === '=') {
        zoomIn()
      } else if (e.key === '-' || e.key === '_') {
        zoomOut()
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [numPages])

  // Touch gestures for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNextPage()
    } else if (isRightSwipe) {
      goToPrevPage()
    }
  }

  // Auto-hide controls on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const timer = setTimeout(() => setShowControls(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [pageNumber])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div 
      className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900"
      onClick={() => window.innerWidth < 768 && setShowControls(true)}
    >
      {/* Toolbar */}
      <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 shadow-sm transition-transform duration-300 ${!showControls && window.innerWidth < 768 ? '-translate-y-full' : 'translate-y-0'}`}>
        {/* Mobile Layout */}
        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ←
            </button>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages))}
                className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
              <span className="text-gray-600 dark:text-gray-400 text-sm">/ {numPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              →
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages))}
                className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-600 dark:text-gray-400">/ {numPages}</span>
            </div>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom Out (-)"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom In (+)"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Fullscreen (F)"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        className="flex-1 overflow-auto flex items-start justify-center p-2 sm:p-4 bg-gray-100 dark:bg-gray-900"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">
              {isExternalUrl ? 'Loading PDF from external URL...' : 'Loading PDF...'}
            </div>
          </div>
        )}
        <Document
          file={processedFileUrl}
          options={pdfOptions}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('PDF Load Error:', error)
            setError(error.message || 'Failed to load PDF')
            setLoading(false)
          }}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500 dark:text-gray-400">
                {isExternalUrl ? (
                  <div className="text-center">
                    <div className="mb-2">Loading external PDF...</div>
                    <div className="text-xs text-gray-400">
                      Nếu PDF không load, kiểm tra link hoặc thử download về máy
                    </div>
                  </div>
                ) : (
                  'Loading PDF...'
                )}
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <div className="text-center px-4 max-w-lg">
                <div className="text-red-500 mb-3">
                  ❌ Không thể load PDF
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {error || 'Vui lòng kiểm tra đường dẫn file hoặc URL'}
                </p>
                {isExternalUrl && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 text-sm">
                      💡 Tips cho external URLs:
                    </p>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                      <li>Đảm bảo link là direct link đến file PDF</li>
                      <li>OneDrive: Dùng link "Embed" thay vì "Share"</li>
                      <li>Google Drive: Bật "Anyone with link can view"</li>
                      <li>Một số site có CORS restrictions - thử download về máy</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            width={pageWidth || undefined}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl bg-white mx-auto"
          />
        </Document>
      </div>

      {/* Keyboard Shortcuts Info - Hidden on mobile */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        Shortcuts: Arrow Keys/Space (Navigate) | +/- (Zoom) | F (Fullscreen) | Swipe left/right on touch devices
      </div>

      {/* Mobile hint */}
      <div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        👆 Tap to show controls | 👈👉 Swipe to navigate
      </div>
    </div>
  )
}
