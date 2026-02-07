import { getAllArticlesMetadata } from '@/lib/articles'
import { getFeaturedProducts, getActiveDeals } from '@/lib/affiliate'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'
import { ProductGrid, DealBadge } from '@/components/affiliate'
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
  
  // Featured articles (top 3 most recent)
  const recentArticles = articles.slice(0, 3)

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
      {recentArticles.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                📝 Bài viết & Review mới nhất
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Chia sẻ kiến thức, kinh nghiệm và đánh giá sản phẩm chi tiết
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 rounded-button font-semibold shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                Đọc thêm {articles.length} bài viết
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      <section className="cta-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="card-interactive p-12">
            <div className="text-5xl mb-6">📬</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nhận deals hot mỗi tuần
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Đăng ký để không bỏ lỡ các deals độc quyền, mã giảm giá đặc biệt 
              và review sản phẩm mới nhất
            </p>
            <NewsletterForm />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              ✅ Miễn phí · ✅ Không spam · ✅ Hủy bất cứ lúc nào
            </p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Danh mục phổ biến
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Laptop', icon: '💻', href: '/products?category=laptop' },
              { name: 'Khóa học', icon: '📚', href: '/products?category=course' },
              { name: 'Software', icon: '⚡', href: '/products?category=software' },
              { name: 'Công cụ Dev', icon: '🛠️', href: '/products?category=tools' },
              { name: 'Hosting', icon: '🌐', href: '/products?category=hosting' },
              { name: 'Design', icon: '🎨', href: '/products?category=design' },
              { name: 'Marketing', icon: '📊', href: '/products?category=marketing' },
              { name: 'Khác', icon: '✨', href: '/products' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="card card-interactive p-6 text-center group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-gradient-cta py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tiết kiệm chi phí?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Tham gia hàng ngàn người dùng thông minh đang tiết kiệm hàng triệu đồng mỗi tháng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-brand-600 rounded-button font-bold text-lg shadow-elevation-3 hover:shadow-elevation-4 hover:scale-105 transition-all"
            >
              Bắt đầu ngay
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-button font-bold text-lg hover:bg-white/20 transition-all"
            >
              Liên hệ hợp tác
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
