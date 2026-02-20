import { NextRequest, NextResponse } from 'next/server'
import { getArticleMetadata } from '@/lib/articles'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const metadata = getArticleMetadata(params.slug)

    if (!metadata) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching article metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}
