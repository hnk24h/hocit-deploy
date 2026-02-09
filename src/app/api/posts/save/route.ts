import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

interface SavePostRequest {
  slug: string
  title: string
  description: string
  date: string
  category: string
  content: string
}

export async function POST(request: NextRequest) {
  try {
    // Only allow saving in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          error: 'Editor chỉ hoạt động ở local development',
          details: 'Vui lòng chạy editor ở localhost (npm run dev), sau đó dùng nút Publish để deploy lên production.'
        },
        { status: 403 }
      )
    }

    const body: SavePostRequest = await request.json()
    const { slug, title, description, date, category, content } = body

    // Validate required fields
    if (!slug || !title || !description || !date || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sanitize slug (prevent path traversal)
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    if (sanitizedSlug !== slug) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use only letters, numbers, and hyphens.' },
        { status: 400 }
      )
    }

    // Build markdown content with frontmatter
    const frontmatter = `---
title: "${title}"
description: "${description}"
date: "${date}"
category: "${category}"
slug: "${slug}"
---

${content}`

    // Define file path
    const contentDir = path.join(process.cwd(), 'content', 'articles')
    const filePath = path.join(contentDir, `${sanitizedSlug}.md`)

    // Ensure directory exists
    await mkdir(contentDir, { recursive: true })

    // Write file
    await writeFile(filePath, frontmatter, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Post saved successfully',
      slug: sanitizedSlug,
      path: filePath,
    })
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: 'Failed to save post', details: (error as Error).message },
      { status: 500 }
    )
  }
}
