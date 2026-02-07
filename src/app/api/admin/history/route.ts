import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HISTORY_DIR = path.join(process.cwd(), 'data', 'history')
const METADATA_FILE = path.join(process.cwd(), 'data', 'metadata.json')

// GET - List all history files and metadata
export async function GET() {
  try {
    const historyFiles: string[] = []
    let metadata: any = { changes: [] }

    // List history files
    if (existsSync(HISTORY_DIR)) {
      const files = await readdir(HISTORY_DIR)
      historyFiles.push(...files.filter(f => f.endsWith('.json')).sort().reverse())
    }

    // Load metadata
    if (existsSync(METADATA_FILE)) {
      const content = await readFile(METADATA_FILE, 'utf-8')
      metadata = JSON.parse(content)
    }

    // Group changes by date for analytics
    const changesByDate: Record<string, any> = {}
    metadata.changes.forEach((change: any) => {
      const date = change.date
      if (!changesByDate[date]) {
        changesByDate[date] = {
          date,
          creates: 0,
          updates: 0,
          deletes: 0,
          total: 0,
        }
      }
      
      if (change.action === 'CREATE_PRODUCT') changesByDate[date].creates++
      if (change.action === 'UPDATE_PRODUCT') changesByDate[date].updates++
      if (change.action === 'DELETE_PRODUCT') changesByDate[date].deletes++
      changesByDate[date].total++
    })

    const analytics = Object.values(changesByDate).sort((a: any, b: any) => 
      b.date.localeCompare(a.date)
    )

    return NextResponse.json({
      success: true,
      historyFiles,
      recentChanges: metadata.changes.slice(-20).reverse(),
      analytics,
      totalChanges: metadata.changes.length,
    })
  } catch (error) {
    console.error('Error loading history:', error)
    return NextResponse.json(
      { error: 'Failed to load history' },
      { status: 500 }
    )
  }
}
