import { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticlesMetadata } from '@/lib/articles'
import { getCategories } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'Blog - Chia sẻ kiến thức lập trình và công nghệ',
  description: 'Khám phá các bài viết về lập trình, JavaScript, React, Next.js, SQL và nhiều chủ đề công nghệ thú vị khác.',
  openGraph: {
    title: 'Blog - Chia sẻ kiến thức lập trình và công nghệ',
    description: 'Khám phá các bài viết về lập trình, JavaScript, React, Next.js, SQL và nhiều chủ đề công nghệ thú vị khác.',
  },
}

export default function BlogPage() {
  const articles = getAllArticlesMetadata()
  const categories = getCategories()
  
  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hôm nay'
    if (diffInDays === 1) return 'Hôm qua'
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`
    return `${Math.floor(diffInDays / 365)} năm trước`
  }

  // Get category info
  const getCategoryInfo = (slug: string) => {
    return categories.find(c => c.slug === slug) || { name: slug, icon: '📁' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              📝 Blog
            </h1>
            <p className="text-xl text-brand-100 mb-6 animate-slide-up">
              Chia sẻ kiến thức về lập trình, công nghệ và những trải nghiệm thực tế
            </p>
            <div className="flex flex-wrap gap-3 animate-scale-in">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                📚 {articles.length} bài viết
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                🏷️ {categories.length} chủ đề
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✍️ Cập nhật thường xuyên
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-card shadow-elevation-2 p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🏷️ Chủ đề
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className="block px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                  >
                    📚 Tất cả ({articles.length})
                  </Link>
                  {categories.map((category) => {
                    const count = articles.filter(a => a.category === category.slug).length
                    return (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="flex justify-between items-center">
                          <span>
                            {category.icon} {category.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count}
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Social Subscription */}
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-800 rounded-card shadow-elevation-3 p-6 text-white">
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                  🔔 Theo dõi chúng tôi
                </h2>
                <p className="text-brand-100 text-sm mb-4">
                  Đừng bỏ lỡ những nội dung mới nhất!
                </p>
                <div className="space-y-3">
                  <a
                    href="https://youtube.com/@yourchannelhere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm">YouTube</div>
                      <div className="text-xs text-brand-100">Video hướng dẫn</div>
                    </div>
                  </a>

                  <a
                    href="https://facebook.com/yourpage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm">Facebook</div>
                      <div className="text-xs text-brand-100">Cộng đồng & thảo luận</div>
                    </div>
                  </a>

                  <a
                    href="https://tiktok.com/@yourhandle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm">TikTok</div>
                      <div className="text-xs text-brand-100">Short videos & tips</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Articles List */}
          <main className="lg:col-span-9">
            <div className="space-y-6">
              {sortedArticles.map((article) => {
                const categoryInfo = getCategoryInfo(article.category)
                return (
                  <article
                    key={article.slug}
                    className="bg-white dark:bg-gray-800 rounded-card shadow-elevation-2 hover:shadow-elevation-3 transition-all border border-gray-200 dark:border-gray-700 overflow-hidden group"
                  >
                    <Link 
                      href={`/articles/${article.slug}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Date Badge */}
                        <div className="flex-shrink-0">
                          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-3 text-center min-w-[80px]">
                            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                              {new Date(article.date).getDate()}
                            </div>
                            <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                              Tháng {new Date(article.date).getMonth() + 1}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(article.date).getFullYear()}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="inline-flex items-center gap-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium px-3 py-1 rounded-full">
                              {categoryInfo.icon} {categoryInfo.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              📅 {getRelativeTime(article.date)}
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                            {article.title}
                          </h2>

                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {article.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(article.date)}
                            </span>
                            <span className="text-brand-600 dark:text-brand-400 font-medium text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                              Đọc thêm
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}

              {articles.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Chưa có bài viết nào
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hãy quay lại sau để đọc những bài viết mới nhất!
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
