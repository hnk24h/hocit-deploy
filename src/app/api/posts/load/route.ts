import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Sanitize slug (prevent path traversal)
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()

    // Define file path
    const filePath = path.join(
      process.cwd(),
      'content',
      'articles',
      `${sanitizedSlug}.md`
    )

    // Read file
    const fileContent = await readFile(filePath, 'utf-8')

    // Parse frontmatter
    const { data, content } = matter(fileContent)

    return NextResponse.json({
      success: true,
      post: {
        slug: sanitizedSlug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        category: data.category || '',
        content: content.trim(),
      },
    })
  } catch (error) {
    console.error('Error loading post:', error)
    
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to load post', details: (error as Error).message },
      { status: 500 }
    )
  }
}
