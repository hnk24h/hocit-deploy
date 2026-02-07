import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HISTORY_DIR = path.join(process.cwd(), 'data', 'history')

// GET - Load specific date's backup
export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = params.date
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const historyFile = path.join(HISTORY_DIR, `${date}.json`)

    if (!existsSync(historyFile)) {
      return NextResponse.json(
        { error: 'Backup not found for this date' },
        { status: 404 }
      )
    }

    const fileContent = await readFile(historyFile, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      date,
      data,
      productCount: data.products?.length || 0,
      dealsCount: data.deals?.length || 0,
    })
  } catch (error) {
    console.error('Error loading backup:', error)
    return NextResponse.json(
      { error: 'Failed to load backup' },
      { status: 500 }
    )
  }
}
