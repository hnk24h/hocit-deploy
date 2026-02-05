import { getAllCategories, getArticlesByCategory } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    slug: category.toLowerCase(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  
  return {
    title: `${categoryName} - Ikagi`,
    description: `Tất cả bài viết về ${categoryName}`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const articles = getArticlesByCategory(params.slug)

  if (articles.length === 0) {
    notFound()
  }

  const categoryName = articles[0].category

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="mb-4">
            <Link href="/" className="text-blue-100 hover:text-white">
              ← Trang chủ
            </Link>
          </nav>
          <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
          <p className="text-blue-100">
            {articles.length} bài viết
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  )
}
