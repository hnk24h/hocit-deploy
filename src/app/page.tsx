import { getAllArticlesMetadata } from '@/lib/articles'
import { getFeaturedProducts, getActiveDeals } from '@/lib/affiliate'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'
import { ProductGrid, DealBadge } from '@/components/affiliate'
import { AdUnit, AdSidebar } from '@/components/ads'
import ADS_CONFIG from '@/config/ads.config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Hub - Khám phá sản phẩm tốt nhất & Deals hot | Hocit',
  description: 'Nền tảng affiliate marketing hàng đầu Việt Nam. Khám phá hàng trăm sản phẩm chất lượng, deals hot, mã giảm giá độc quyền và bài viết review chi tiết. Tiết kiệm chi phí, mua sắm thông minh.',
  keywords: 'affiliate marketing, deals, coupons, mã giảm giá, sản phẩm công nghệ, laptop, khóa học, developer tools',
  openGraph: {
    title: 'Affiliate Hub - Sản phẩm tốt nhất & Deals hot',
    description: 'Khám phá hàng trăm sản phẩm chất lượng, deals hot và mã giảm giá độc quyền',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Hub - Sản phẩm tốt nhất & Deals hot',
    description: 'Khám phá hàng trăm sản phẩm chất lượng, deals hot và mã giảm giá độc quyền',
  },
  alternates: {
    canonical: '/',
  },
}

export default function Page() {
  const articles = getAllArticlesMetadata()
  const featuredProducts = getFeaturedProducts().slice(0, 6)
  const activeDeals = getActiveDeals().slice(0, 3)
  
  // Filter articles by affiliate platforms (amazon, rakuten, shopee)
  const affiliateCategories = ['amazon', 'rakuten', 'shopee']
  const affiliateArticles = articles.filter(article => 
    affiliateCategories.includes(article.category.toLowerCase())
  )
  
  // Featured articles (top 3 most recent from affiliate categories)
  const recentArticles = affiliateArticles.slice(0, 3)

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Affiliate Hub',
            url: 'https://yourdomain.com',
            description: 'Nền tảng affiliate marketing hàng đầu Việt Nam',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://yourdomain.com/products?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Hero Section - Above the fold */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center text-white space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 animate-fade-in">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold">Top #1 Affiliate Hub Việt Nam</span>
            </div>

            {/* Main Heading - H1 for SEO */}
            <h1 className="text-4xl md:text-6xl font-bold animate-slide-up">
              Khám phá sản phẩm tốt nhất
              <br />
              <span className="text-yellow-300">Tiết kiệm đến 70%</span>
            </h1>

            {/* Value Proposition */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in">
              Hàng trăm sản phẩm chất lượng, deals hot mỗi ngày, 
              mã giảm giá độc quyền và review chi tiết từ chuyên gia
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-brand-600 rounded-button font-bold text-lg shadow-elevation-3 hover:shadow-elevation-4 hover:scale-105 transition-all touch-target"
              >
                🛍️ Khám phá sản phẩm
              </Link>
              <Link
                href="/deals"
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-button font-bold text-lg shadow-elevation-3 hover:shadow-elevation-4 hover:scale-105 transition-all touch-target"
              >
                🔥 Xem Deals hot
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>Review trung thực</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span>Deals độc quyền</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span>Tiết kiệm tối đa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-12 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Sản phẩm</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {activeDeals.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Deals hot</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Đối tác</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Người dùng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🗂️ Danh mục phổ biến
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Khám phá sản phẩm theo từng danh mục
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Laptop', icon: '💻', href: '/products?category=laptop', count: '50+' },
              { name: 'Khóa học', icon: '📚', href: '/products?category=course', count: '30+' },
              { name: 'Software', icon: '⚡', href: '/products?category=software', count: '40+' },
              { name: 'Công cụ Dev', icon: '🛠️', href: '/products?category=tools', count: '25+' },
              { name: 'Hosting', icon: '🌐', href: '/products?category=hosting', count: '15+' },
              { name: 'Design', icon: '🎨', href: '/products?category=design', count: '20+' },
              { name: 'Marketing', icon: '📊', href: '/products?category=marketing', count: '18+' },
              { name: 'Amazon', icon: '📦', href: '/blog?category=amazon', count: 'New' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="card card-interactive p-6 text-center group relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">
                  {category.count}
                </div>
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-brand-600 dark:text-brand-400 font-semibold hover:gap-3 transition-all"
            >
              Xem tất cả danh mục
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      {activeDeals.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-red-50 to-white dark:from-red-900/10 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4 badge-hot">
                🔥 HOT DEALS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Deals đang hot nhất hôm nay
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Nhanh tay chốt đơn trước khi hết hạn!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {activeDeals.map((deal, index) => (
                <div
                  key={index}
                  className="card card-interactive p-6 border-2 border-red-200 dark:border-red-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      {deal.title}
                    </h3>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-2">
                      {deal.discount}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {deal.description}
                  </p>

                  {deal.code && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-dashed border-yellow-400 dark:border-yellow-600 rounded-button p-3 mb-4">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Mã giảm giá:
                      </div>
                      <div className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                        {deal.code}
                      </div>
                    </div>
                  )}

                  <a
                    href={deal.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full py-3 px-4 bg-gradient-primary text-white rounded-button font-semibold text-center hover:scale-[1.02] transition-transform shadow-elevation-2"
                  >
                    Nhận deal ngay →
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                Xem tất cả {activeDeals.length} deals
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ⭐ Sản phẩm được đề xuất
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Những sản phẩm được review và đánh giá cao nhất
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content - 75% width */}
              <div className="lg:col-span-9">
                <ProductGrid products={featuredProducts} />

                <div className="text-center mt-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-button font-bold text-lg shadow-elevation-3 hover:shadow-elevation-4 hover:scale-105 transition-all"
                  >
                    Khám phá 200+ sản phẩm
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Sidebar - 25% width, Desktop only */}
              <aside className="lg:col-span-3 hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* Ad Slot - Homepage Sidebar Top */}
                  <div>
                    <AdSidebar slot={ADS_CONFIG.slots['homepage-sidebar']} />
                  </div>

                  {/* Quick Stats Card */}
                  <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl shadow-elevation-3 p-6 text-white">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span>📊</span>
                      <span>Thống kê nhanh</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">200+</div>
                        <div className="text-sm text-white/80">Sản phẩm đã review</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-sm text-white/80">Đối tác uy tín</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-2xl font-bold">10K+</div>
                        <div className="text-sm text-white/80">Người dùng tin cậy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Categories/Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tại sao chọn Affiliate Hub?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nền tảng uy tín, minh bạch và tiết kiệm nhất
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Review trung thực
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Đánh giá chi tiết, khách quan từ đội ngũ chuyên gia. 
                Không bao giờ giấu nhẹm nhược điểm.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Tiết kiệm tối đa
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deals độc quyền, mã giảm giá đặc biệt. 
                So sánh giá thông minh giúp bạn mua đúng lúc.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                An toàn & Uy tín
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chỉ hợp tác với các thương hiệu uy tín. 
                Đảm bảo quyền lợi người dùng tối đa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Content Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              📝 Bài viết & Review mới nhất
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Đánh giá sản phẩm từ Amazon, Rakuten, Shopee - Deals hot nhất
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - 75% width */}
            <div className="lg:col-span-9">
              {recentArticles.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {recentArticles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sắp có bài viết mới!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Chúng tôi đang chuẩn bị các bài review sản phẩm từ Amazon, Rakuten và Shopee.
                    <br />
                    Đăng ký nhận thông báo để không bỏ lỡ deals hot nhất!
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 transition-all"
                  >
                    Xem tất cả bài viết
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}

              {recentArticles.length > 0 && (
                <div className="text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 transition-all"
                  >
                    Xem tất cả bài viết
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar - 25% width, Desktop only */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Ad Slot - Homepage Mid Content */}
                <div>
                  <AdUnit 
                    slot={ADS_CONFIG.slots['homepage-mid-content']} 
                    size="300x250"
                    className="rounded-2xl overflow-hidden shadow-elevation-2"
                  />
                </div>

                {/* Popular Categories Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-2 border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🔥</span>
                    <span>Danh mục hot</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Amazon', icon: '📦', href: '/blog?category=amazon' },
                      { name: 'Rakuten', icon: '🛍️', href: '/blog?category=rakuten' },
                      { name: 'Shopee', icon: '🛒', href: '/blog?category=shopee' },
                      { name: 'Laptop', icon: '💻', href: '/products?category=laptop' },
                    ].map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                        <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-28 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce">📧</div>
        <div className="absolute top-20 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
        <div className="absolute bottom-10 left-1/3 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>💎</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>⚡</div>

        <div className="relative max-w-5xl mx-auto px-4">
          {/* Header Content */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg mb-6">
              <span className="text-xl">🔔</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">8,500+ người đã đăng ký</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Đừng bỏ lỡ
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Deals độc quyền mỗi tuần
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Nhận ngay các deals hot nhất, mã giảm giá đặc biệt và review sản phẩm chi tiết từ chuyên gia. Hoàn toàn miễn phí!
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-2xl">
                  💰
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">Tiết kiệm $50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mỗi tháng trung bình</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">Deals độc quyền</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Không có ở nơi khác</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-2xl">
                  📬
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">Mỗi thứ 2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1 email/tuần, đúng giờ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <NewsletterForm />

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-gray-600 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Miễn phí 100%</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Không spam</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Hủy bất cứ lúc nào</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bảo mật thông tin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-purple-900 py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">💰</div>
        <div className="absolute top-20 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
        <div className="absolute bottom-10 left-1/4 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>⚡</div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-white">
              <span className="text-xl">🚀</span>
              <span className="font-semibold">Tham gia cộng đồng 10,000+ thành viên</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sẵn sàng tiết kiệm
              <br />
              <span className="text-yellow-300">hàng triệu đồng</span> mỗi tháng?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Tham gia hàng ngàn người dùng thông minh đang mua sắm tiết kiệm với deals độc quyền và mã giảm giá đặc biệt
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">1M+</div>
              <div className="text-white/80 text-sm md:text-base">Tiết kiệm/tháng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">200+</div>
              <div className="text-white/80 text-sm md:text-base">Deals hot</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">50+</div>
              <div className="text-white/80 text-sm md:text-base">Đối tác</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-white/80 text-sm md:text-base">Thành viên</div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-brand-600">
                ✓
              </div>
              <div>
                <div className="font-semibold mb-1">Review trung thực</div>
                <div className="text-sm text-white/80">Đánh giá chi tiết từ chuyên gia</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-brand-600">
                ✓
              </div>
              <div>
                <div className="font-semibold mb-1">Deals độc quyền</div>
                <div className="text-sm text-white/80">Mã giảm giá không tìm thấy ở đâu khác</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-brand-600">
                ✓
              </div>
              <div>
                <div className="font-semibold mb-1">Miễn phí 100%</div>
                <div className="text-sm text-white/80">Không phí ẩn, không spam email</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/products"
              className="group px-10 py-5 bg-white text-brand-600 rounded-button font-bold text-lg shadow-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>🎯 Khám phá ngay</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/deals"
              className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-button font-bold text-lg shadow-2xl hover:shadow-[0_20px_50px_rgba(251,191,36,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>🔥 Xem Deals hot</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Secondary CTA */}
          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-lg hover:gap-3 transition-all"
            >
              Hoặc liên hệ hợp tác đối tác
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 rating</span>
              </div>
              <div>•</div>
              <div>🔒 An toàn & bảo mật</div>
              <div>•</div>
              <div>✅ Đánh giá 2,000+ reviews</div>
              <div>•</div>
              <div>📱 Hỗ trợ 24/7</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
