// Server-side affiliate utilities
// These functions use Node.js APIs and can only be called from server components/API routes

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'affiliate-data.json');
const CLICKS_FILE = path.join(process.cwd(), 'data', 'affiliate-clicks.json');

export interface AffiliateLink {
  slug: string;
  targetUrl: string;
  product: string;
  merchant: string;
  commission?: number;
  category?: string;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  affiliateLink: string;
  pros: string[];
  cons: string[];
  category: string;
  tags?: string[];
  featured?: boolean;
  detailedReview?: string;
}

export interface Deal {
  title: string;
  description: string;
  code?: string;
  discount: string;
  affiliateLink: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ClickEvent {
  linkSlug: string;
  timestamp: string;
  ipHash: string;
  userAgent: string;
  referrer?: string;
  device?: string;
}

// Load affiliate data
export function loadAffiliateData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading affiliate data:', error);
    return { links: [], products: [], deals: [] };
  }
}

// Get affiliate link by slug
export function getAffiliateLink(slug: string): AffiliateLink | null {
  const data = loadAffiliateData();
  return data.links.find((link: AffiliateLink) => link.slug === slug) || null;
}

// Get all affiliate links
export function getAllAffiliateLinks(): AffiliateLink[] {
  const data = loadAffiliateData();
  return data.links || [];
}

// Get product by slug
export function getProduct(slug: string): Product | null {
  const data = loadAffiliateData();
  return data.products.find((product: Product) => product.slug === slug) || null;
}

// Get all products
export function getAllProducts(): Product[] {
  const data = loadAffiliateData();
  return data.products || [];
}

// Get featured products
export function getFeaturedProducts(): Product[] {
  const data = loadAffiliateData();
  return data.products.filter((product: Product) => product.featured) || [];
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  const data = loadAffiliateData();
  return data.products.filter((product: Product) => product.category === category) || [];
}

// Get active deals
export function getActiveDeals(): Deal[] {
  const data = loadAffiliateData();
  const now = new Date();
  return data.deals.filter((deal: Deal) => {
    if (!deal.isActive) return false;
    const endDate = new Date(deal.endDate);
    return endDate >= now;
  }) || [];
}

// Track click event
export function trackClick(clickData: ClickEvent): void {
  try {
    let clicks: ClickEvent[] = [];
    
    // Load existing clicks
    if (fs.existsSync(CLICKS_FILE)) {
      const data = fs.readFileSync(CLICKS_FILE, 'utf-8');
      clicks = JSON.parse(data);
    }
    
    // Add new click
    clicks.push(clickData);
    
    // Keep only last 10000 clicks to prevent file from growing too large
    if (clicks.length > 10000) {
      clicks = clicks.slice(-10000);
    }
    
    // Save
    fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2));
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

// Get click stats for a link
export function getClickStats(slug: string): { total: number; last24h: number; last7d: number } {
  try {
    if (!fs.existsSync(CLICKS_FILE)) {
      return { total: 0, last24h: 0, last7d: 0 };
    }
    
    const data = fs.readFileSync(CLICKS_FILE, 'utf-8');
    const clicks: ClickEvent[] = JSON.parse(data);
    
    const linkClicks = clicks.filter(click => click.linkSlug === slug);
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: linkClicks.length,
      last24h: linkClicks.filter(click => new Date(click.timestamp) >= last24h).length,
      last7d: linkClicks.filter(click => new Date(click.timestamp) >= last7d).length,
    };
  } catch (error) {
    console.error('Error getting click stats:', error);
    return { total: 0, last24h: 0, last7d: 0 };
  }
}

// Hash IP address for privacy
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// Detect device type from user agent
export function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Format price
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
