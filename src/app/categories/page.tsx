import { getAllCategories, getArticlesByCategory } from '@/lib/articles'
import Link from 'next/link'

export const metadata = {
  title: 'Danh mục - Ikagi',
  description: 'Khám phá các danh mục bài viết',
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="mb-4">
            <Link href="/" className="text-blue-100 hover:text-white">
              ← Trang chủ
            </Link>
          </nav>
          <h1 className="text-4xl font-bold">Danh mục</h1>
          <p className="text-blue-100 mt-2">
            Khám phá các chủ đề lập trình
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Chưa có danh mục nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const articles = getArticlesByCategory(category)
              return (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {category}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {articles.length} bài viết
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
