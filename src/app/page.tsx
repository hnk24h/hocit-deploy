import { getAllArticlesMetadata } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'
import Link from 'next/link'

export default function Page() {
  const articles = getAllArticlesMetadata()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">Ikagi</h1>
          <p className="text-xl text-slate-200 animate-slide-up">
            Học lập trình từ cơ bản đến nâng cao với các bài viết chất lượng
          </p>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-12">
        <NewsletterForm />
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bài viết mới nhất
          </h2>
          <Link
            href="/categories"
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
          >
            Xem theo danh mục →
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Chưa có bài viết nào. Hãy thêm bài viết vào thư mục content/articles/
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
