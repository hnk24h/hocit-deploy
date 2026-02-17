import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles'
import { markdownToHtml } from '@/lib/markdown'
import { extractHeadings, addHeadingIds } from '@/lib/toc'
import TableOfContents from '@/components/TableOfContents'
import PrismLoader from '@/components/PrismLoader'
import GiscusComments from '@/components/GiscusComments'
import AuthorBio from '@/components/AuthorBio'
import ViewTracker from '@/components/ViewTracker'
import ViewCount from '@/components/ViewCount'
import { StructuredData, generateBreadcrumbStructuredData } from '@/components/StructuredData'
import { AdUnit, AdLeaderboard } from '@/components/ads'
import ADS_CONFIG from '@/config/ads.config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site'
  const articleUrl = `${siteUrl}/articles/${params.slug}`

  return {
    title: article.title,
    description: article.description,
    keywords: [article.category, 'lập trình', 'programming', 'tutorial'],
    authors: [{ name: 'Ikagi' }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: ['Ikagi'],
      url: articleUrl,
      siteName: 'Ikagi',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: articleUrl,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  let contentHtml = await markdownToHtml(article.content || '')
  contentHtml = addHeadingIds(contentHtml)
  const headings = extractHeadings(contentHtml)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ikagi.site'
  const breadcrumbs = [
    { name: 'Trang chủ', url: siteUrl },
    { name: article.category, url: `${siteUrl}/category/${encodeURIComponent(article.category.toLowerCase())}` },
    { name: article.title, url: `${siteUrl}/articles/${params.slug}` },
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ViewTracker slug={article.slug} />
      <PrismLoader />
      
      {/* Structured Data for SEO */}
      <StructuredData type="Article" data={article} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData(breadcrumbs)),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {article.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {article.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                <time>
                  📅 {new Date(article.date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <ViewCount slug={article.slug} />
              </div>
            </header>

            {/* Ad After Title */}
            <div className="mb-8">
              <AdLeaderboard slot={ADS_CONFIG.slots['article-top']} />
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-red-600 dark:prose-code:text-red-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 dark:prose-li:text-gray-300 dark:prose-blockquote:text-gray-300 dark:prose-blockquote:border-gray-600 [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:my-6"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Ad After Content */}
            <div className="mt-8 mb-8">
              <AdLeaderboard slot={ADS_CONFIG.slots['article-bottom']} />
            </div>

            {/* Author Bio */}
            <AuthorBio />

            {/* Comments Section */}
            <GiscusComments slug={article.slug} title={article.title} />
          </article>

          {/* Table of Contents - Sticky Sidebar */}
          {headings.length > 0 ? (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Ad Slot - Article Sidebar (Highest Revenue) */}
                <div>
                  <AdUnit 
                    slot={ADS_CONFIG.slots['article-sidebar']} 
                    size="300x600"
                    className="rounded-2xl overflow-hidden shadow-elevation-2"
                  />
                </div>

                {/* Table of Contents */}
                <TableOfContents headings={headings} />
              </div>
            </aside>
          ) : (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                {/* Ad Slot - Article Sidebar (when no TOC) */}
                <AdUnit 
                  slot={ADS_CONFIG.slots['article-sidebar']} 
                  size="300x600"
                  className="rounded-2xl overflow-hidden shadow-elevation-2"
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}
