import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Approve/reject a comment (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, approved } = body
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    // Check admin authorization
    if (token !== process.env.ADMIN_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!commentId || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { approved },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// GET - Fetch pending comments (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    // Check admin authorization
    if (token !== process.env.ADMIN_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pendingComments = await prisma.comment.findMany({
      where: { approved: false },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        articleSlug: true,
        author: true,
        email: true,
        content: true,
        createdAt: true,
        parentId: true,
      },
    })

    return NextResponse.json(pendingComments)
  } catch (error) {
    console.error('Error fetching pending comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
