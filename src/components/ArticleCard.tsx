import Link from 'next/link'
import { ArticleMetadata } from '@/types/article'
import ViewCount from './ViewCount'

interface ArticleCardProps {
  article: ArticleMetadata
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="card-interactive p-6 animate-fade-in group">
      <Link href={`/articles/${article.slug}`}>
        <div className="mb-4">
          <span className="inline-block bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {article.category}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {article.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {article.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <time className="text-sm text-gray-500 dark:text-gray-500 font-medium">
              📅 {new Date(article.date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <ViewCount slug={article.slug} showIcon={true} />
          </div>
          <span className="text-brand-600 dark:text-brand-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
            Đọc thêm →
          </span>
        </div>
      </Link>
    </article>
  )
}
