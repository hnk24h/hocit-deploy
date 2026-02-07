// Client-side types and utilities for affiliate system
// No server-side dependencies (fs, path, etc.)

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

// Format price (client-safe)
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Calculate discount percentage (client-safe)
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
