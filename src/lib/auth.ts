import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + process.env.ADMIN_TOKEN_SECRET)
    .digest('hex')
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

export function generateToken(username: string): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const tokenData = `${username}_${date}_${process.env.ADMIN_TOKEN_SECRET}`
  return crypto.createHash('sha256').update(tokenData).digest('hex')
}

export function verifyCredentials(username: string, password: string): boolean {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
}

export function createSessionToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    token: generateToken(username),
  }
  
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
    .update(base64Payload)
    .digest('hex')
  
  return `${base64Payload}.${signature}`
}

export function verifySessionToken(sessionToken: string): { valid: boolean; username?: string } {
  try {
    const [base64Payload, signature] = sessionToken.split('.')
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
      .update(base64Payload)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return { valid: false }
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
    
    // Check if token is less than 24 hours old
    const age = Date.now() - payload.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (age > maxAge) {
      return { valid: false }
    }
    
    return { valid: true, username: payload.username }
  } catch (error) {
    return { valid: false }
  }
}

// User Authentication Helper
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface CurrentUser {
  id: string
  email: string
  username: string
  name: string | null
  avatar: string | null
}

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return null
    }

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
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
