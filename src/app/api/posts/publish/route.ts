import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { access } from 'fs/promises'

const execPromise = promisify(exec)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PublishRequest {
  slug: string
  title: string
}

export async function POST(request: NextRequest) {
  try {
    // Only allow publishing from development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { 
          error: 'Publish chỉ hoạt động ở local development',
          details: 'Vui lòng chạy editor ở localhost (npm run dev) để publish bài viết.'
        },
        { status: 403 }
      )
    }

    const body: PublishRequest = await request.json()
    const { slug, title } = body

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title' },
        { status: 400 }
      )
    }

    // Check if article file exists
    const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`)
    try {
      await access(articlePath)
    } catch {
      return NextResponse.json(
        { error: `Article not found: ${slug}.md. Please save the post first.` },
        { status: 404 }
      )
    }

    // Escape special characters for PowerShell
    const escapeForPowerShell = (str: string): string => {
      return str
        .replace(/"/g, '`"')  // Escape double quotes with backtick
        .replace(/'/g, "''")  // Escape single quotes by doubling them
        .replace(/`/g, '``')  // Escape backticks
    }

    const escapedSlug = escapeForPowerShell(slug)
    const escapedTitle = escapeForPowerShell(title)

    // Run publish script
    const scriptPath = path.join(process.cwd(), 'scripts', 'publish-post.ps1')
    const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -slug "${escapedSlug}" -title "${escapedTitle}"`

    try {
      const { stdout, stderr } = await execPromise(command, {
        cwd: process.cwd(),
        timeout: 30000, // 30 second timeout
      })

      return NextResponse.json({
        success: true,
        message: 'Post published successfully',
        slug,
        output: stdout,
        warnings: stderr || undefined,
      })
    } catch (error: any) {
      console.error('Publish script error:', error)
      
      return NextResponse.json(
        {
          error: 'Failed to publish post',
          details: error.message,
          stderr: error.stderr,
          stdout: error.stdout,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish post', details: (error as Error).message },
      { status: 500 }
    )
  }
}
