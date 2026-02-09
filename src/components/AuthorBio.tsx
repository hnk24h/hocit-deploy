'use client'

export default function AuthorBio() {
  return (
    <div className="my-12 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-8 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center text-5xl shadow-lg ring-4 ring-white dark:ring-gray-800">
            👨‍💻
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Hoank 🚀
            </h3>
            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
              ✍️ Author
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            💜 <strong>Lập trình viên</strong> và <strong>blogger</strong> đam mê chia sẻ kiến thức về lập trình, công nghệ và kinh nghiệm thực tế.
            Mình viết về JavaScript, React, Next.js, SQL và nhiều chủ đề thú vị khác.
            <br />
            <span className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 block">
              "Học mỗi ngày, chia sẻ mỗi ngày" ✨
            </span>
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://youtube.com/@Ikagi_site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
            >
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-medium">YouTube</span>
            </a>

            <a
              href="https://facebook.com/Ikagi.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm font-medium">Facebook</span>
            </a>

            <a
              href="https://tiktok.com/@ikagi.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="text-sm font-medium">TikTok</span>
            </a>

            <a
              href="mailto:hoankjp17@gmail.com"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
            >
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
