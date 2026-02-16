import { NextResponse } from 'next/server'
import { getAllArticlesMetadata } from '@/lib/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Get all articles metadata
export async function GET() {
  try {
    const articles = getAllArticlesMetadata()
    
    // Return only necessary fields for client
    const articlesData = articles.map(article => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      date: article.date,
    }))

    return NextResponse.json({
      success: true,
      articles: articlesData,
      count: articlesData.length,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
