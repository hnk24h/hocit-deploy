import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Proxy API to bypass CORS restrictions
 * Usage: /api/proxy?url=https://example.com/file.xlsx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(targetUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Security: Only allow certain domains
    const allowedDomains = [
      'docs.google.com',
      'drive.google.com',
      'onedrive.live.com',
      '1drv.ms',
      'dropbox.com',
    ]

    const urlObj = new URL(targetUrl)
    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname.includes(domain)
    )

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Domain not allowed. Only Google Docs, OneDrive, and Dropbox are supported.' },
        { status: 403 }
      )
    }

    console.log('Proxying request to:', targetUrl)

    // Fetch the file
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Get the file content
    const arrayBuffer = await response.arrayBuffer()
    
    // Determine content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Return the file with appropriate headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to proxy request',
        details: 'The target server may be blocking requests or the file may not be publicly accessible.',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
