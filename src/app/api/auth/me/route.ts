import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            avatar: true,
            createdAt: true,
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      // Session expired or not found
      const response = NextResponse.json(
        { user: null },
        { status: 401 }
      )
      response.cookies.delete('auth_token')
      return response
    }

    return NextResponse.json({
      user: session.user
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}
