import { readFileSync } from 'fs'
import path from 'path'

export interface Category {
  slug: string
  name: string
  icon: string
  description?: string
  count?: number
  subCategories?: Category[]
}

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')

export function getCategories(): Category[] {
  try {
    const fileContent = readFileSync(CATEGORIES_FILE, 'utf-8')
    const data = JSON.parse(fileContent)
    return data.categories || []
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories()
  return categories.find(c => c.slug === slug)
}
