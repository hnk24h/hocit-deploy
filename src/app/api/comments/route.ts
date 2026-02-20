import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import crypto from 'crypto'

// GET - Fetch comments for an article
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleSlug = searchParams.get('articleSlug')
    
    if (!articleSlug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      )
    }

    // Fetch approved comments for the article
    const comments = await prisma.comment.findMany({
      where: {
        articleSlug,
        approved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        author: true,
        content: true,
        parentId: true,
        createdAt: true,
        replies: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            author: true,
            content: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    const currentUser = await getCurrentUser(request)
    
    const body = await request.json()
    let { articleSlug, author, email, content, parentId } = body

    // If user is logged in, use their info
    if (currentUser) {
      author = currentUser.name || currentUser.username
      email = currentUser.email
    }

    // Validation
    if (!articleSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (author.length < 2 || author.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 2-50 characters' },
        { status: 400 }
      )
    }

    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be between 10-2000 characters' },
        { status: 400 }
      )
    }

    // Email validation (skip if user logged in)
    if (!currentUser) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }
    }

    // Hash IP for spam prevention
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    const ipHash = crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex')

    // Check for spam (same IP, multiple comments in short time)
    // Logged-in users get higher limit
    const rateLimit = currentUser ? 10 : 3
    const recentComments = await prisma.comment.count({
      where: {
        ipHash,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    })

    if (recentComments >= rateLimit) {
      return NextResponse.json(
        { error: 'Too many comments. Please wait a few minutes.' },
        { status: 429 }
      )
    }

    // Create comment (auto-approved with spam filter)
    const comment = await prisma.comment.create({
      data: {
        articleSlug,
        userId: currentUser?.id || null, // Link to user if logged in
        author: author.trim(),
        email: email.toLowerCase().trim(),
        content: content.trim(),
        parentId: parentId || null,
        ipHash,
        approved: true, // Auto-approve (spam filter via rate limiting)
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully!',
      commentId: comment.id,
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a comment (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('id')
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    // Simple admin check (you should use proper JWT validation)
    if (token !== process.env.ADMIN_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
