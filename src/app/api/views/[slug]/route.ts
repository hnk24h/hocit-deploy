import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Helper: Hash IP for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex').slice(0, 16)
}

// Helper: Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// POST - Track a page view
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    const body = await request.json()
    const { path } = body

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const ip = getClientIP(request)
    const hashedIP = hashIP(ip)
    const userAgent = request.headers.get('user-agent') || undefined
    const referrer = request.headers.get('referer') || undefined

    // Check if this IP viewed recently (within 30 minutes) - prevent spam
    const recentView = await prisma.pageView.findFirst({
      where: {
        slug,
        ip: hashedIP,
        viewedAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      }
    })

    let isNewView = false

    if (!recentView) {
      // Record the view
      await prisma.pageView.create({
        data: {
          slug,
          path: path || `/blog/${slug}`,
          ip: hashedIP,
          userAgent,
          referrer,
        }
      })
      isNewView = true
    }

    // Update or create article stats
    const stats = await prisma.articleStats.upsert({
      where: { slug },
      update: {
        viewCount: { increment: 1 },
        uniqueViews: isNewView ? { increment: 1 } : undefined,
        lastViewedAt: new Date(),
      },
      create: {
        slug,
        viewCount: 1,
        uniqueViews: 1,
      }
    })

    return NextResponse.json({
      success: true,
      viewCount: stats.viewCount,
      uniqueViews: stats.uniqueViews,
      isNewView,
    })

  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}

// GET - Get view count for a slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const stats = await prisma.articleStats.findUnique({
      where: { slug },
      select: {
        viewCount: true,
        uniqueViews: true,
        lastViewedAt: true,
      }
    })

    if (!stats) {
      return NextResponse.json({
        viewCount: 0,
        uniqueViews: 0,
        lastViewedAt: null,
      })
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching view count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    )
  }
}
