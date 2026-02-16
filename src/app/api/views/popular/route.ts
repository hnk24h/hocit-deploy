import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Get popular posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const days = parseInt(searchParams.get('days') || '30') // Default: last 30 days

    // Get popular posts by view count
    const popularStats = await prisma.articleStats.findMany({
      where: days > 0 ? {
        lastViewedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      } : undefined,
      orderBy: {
        viewCount: 'desc'
      },
      take: limit,
      select: {
        slug: true,
        viewCount: true,
        uniqueViews: true,
        lastViewedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      popular: popularStats,
      count: popularStats.length,
    })

  } catch (error) {
    console.error('Error fetching popular posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular posts' },
      { status: 500 }
    )
  }
}
