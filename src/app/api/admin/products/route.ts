import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir, copyFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATA_FILE = path.join(process.cwd(), 'data', 'affiliate-data.json')
const HISTORY_DIR = path.join(process.cwd(), 'data', 'history')
const METADATA_FILE = path.join(process.cwd(), 'data', 'metadata.json')

// Helper: Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// Helper: Backup current file to history
const backupToHistory = async () => {
  try {
    // Ensure history directory exists
    if (!existsSync(HISTORY_DIR)) {
      await mkdir(HISTORY_DIR, { recursive: true })
    }

    const date = getCurrentDate()
    const historyFile = path.join(HISTORY_DIR, `${date}.json`)

    // Only backup once per day (check if today's backup exists)
    if (!existsSync(historyFile) && existsSync(DATA_FILE)) {
      await copyFile(DATA_FILE, historyFile)
      console.log(`✅ Backed up to: ${date}.json`)
    }
  } catch (error) {
    console.error('⚠️ Backup failed (non-critical):', error)
    // Don't throw - backup failure shouldn't stop the main operation
  }
}

// Helper: Update metadata
const updateMetadata = async (action: string, details: any) => {
  try {
    let metadata: any = { changes: [] }
    
    if (existsSync(METADATA_FILE)) {
      const content = await readFile(METADATA_FILE, 'utf-8')
      metadata = JSON.parse(content)
    }

    metadata.changes.push({
      timestamp: new Date().toISOString(),
      date: getCurrentDate(),
      action,
      details,
    })

    // Keep only last 100 changes
    if (metadata.changes.length > 100) {
      metadata.changes = metadata.changes.slice(-100)
    }

    await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf-8')
  } catch (error) {
    console.error('⚠️ Metadata update failed (non-critical):', error)
  }
}

// GET - List all products
export async function GET() {
  try {
    const fileContent = await readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      products: data.products || [],
      total: data.products?.length || 0,
    })
  } catch (error) {
    console.error('Error loading products:', error)
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json()

    // Backup before making changes
    await backupToHistory()

    // Read existing data
    const fileContent = await readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)

    // Validate required fields
    if (!newProduct.slug || !newProduct.name || !newProduct.category) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, name, category' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const exists = data.products?.some((p: any) => p.slug === newProduct.slug)
    if (exists) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Add new product
    if (!data.products) data.products = []
    data.products.push({
      ...newProduct,
      pros: newProduct.pros || [],
      cons: newProduct.cons || [],
      tags: newProduct.tags || [],
      featured: newProduct.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')

    // Update metadata
    await updateMetadata('CREATE_PRODUCT', {
      slug: newProduct.slug,
      name: newProduct.name,
      category: newProduct.category,
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const updatedProduct = await request.json()

    // Backup before making changes
    await backupToHistory()

    // Read existing data
    const fileContent = await readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)

    // Find and update product
    const index = data.products?.findIndex((p: any) => p.slug === updatedProduct.slug)
    if (index === -1 || index === undefined) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Keep original createdAt, update updatedAt
    const originalCreatedAt = data.products[index].createdAt
    
    data.products[index] = {
      ...updatedProduct,
      pros: updatedProduct.pros || [],
      cons: updatedProduct.cons || [],
      tags: updatedProduct.tags || [],
      createdAt: originalCreatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')

    // Update metadata
    await updateMetadata('UPDATE_PRODUCT', {
      slug: updatedProduct.slug,
      name: updatedProduct.name,
      category: updatedProduct.category,
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      )
    }

    // Backup before making changes
    await backupToHistory()

    // Read existing data
    const fileContent = await readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)

    // Find product for metadata before deletion
    const productToDelete = data.products?.find((p: any) => p.slug === slug)

    // Filter out the product
    const initialLength = data.products?.length || 0
    data.products = data.products?.filter((p: any) => p.slug !== slug) || []

    if (data.products.length === initialLength) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')

    // Update metadata
    await updateMetadata('DELETE_PRODUCT', {
      slug: productToDelete?.slug,
      name: productToDelete?.name,
      category: productToDelete?.category,
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
