/**
 * Google AdSense Configuration
 * 
 * Setup Instructions:
 * 1. Create AdSense account: https://www.google.com/adsense
 * 2. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 3. Create ad units and get slot IDs
 * 4. Add to .env.local:
 *    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
 *    NEXT_PUBLIC_ADS_ENABLED=true
 */

export const ADS_CONFIG = {
  // Enable/disable ads globally
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  
  // Your Google AdSense Publisher ID
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',

  /**
   * Ad Slot IDs
   * Replace these with your actual slot IDs from AdSense dashboard
   */
  slots: {
    // Homepage
    'homepage-hero-bottom': '0000000001', // Below hero section
    'homepage-mid-content': '0000000002', // Between content sections
    'homepage-sidebar': '0000000003',     // Sidebar (desktop only)
    'homepage-footer-top': '0000000004',  // Above newsletter

    // Blog listing page
    'blog-sidebar-top': '0000000005',     // Sidebar top (sticky)
    'blog-sidebar-mid': '0000000006',     // Sidebar middle
    'blog-sidebar-bottom': '0000000007',  // Sidebar bottom
    'blog-inline-1': '0000000008',        // Between articles
    'blog-inline-2': '0000000009',        // Between articles

    // Individual article/blog post
    'article-top': '0000000010',          // After title, before content
    'article-sidebar': '0000000011',      // Sidebar (sticky)
    'article-in-content-1': '0000000012', // Mid-article
    'article-in-content-2': '0000000013', // Mid-article
    'article-bottom': '0000000014',       // End of article
    'article-related': '0000000015',      // After related posts

    // Products page (use sparingly - has affiliate links)
    'products-top': '0000000016',         // Top of page
    
    // Category pages
    'category-sidebar': '0000000017',     // Sidebar
    'category-inline': '0000000018',      // Between items

    // Mobile-specific
    'mobile-sticky-footer': '0000000019', // Sticky bottom (mobile)
  },

  /**
   * Ad Density Rules
   * Follow Google AdSense policies to avoid penalties
   */
  rules: {
    // Maximum ads per page (recommended: 3-6)
    maxAdsPerPage: 5,

    // Minimum content between ads (in words)
    minContentWordsBeforeAd: 300,

    // Minimum paragraphs between in-content ads
    minParagraphsBetweenAds: 3,

    // Ad-to-content ratio (max 30% is safe)
    maxAdToContentRatio: 0.25,
  },

  /**
   * Page-specific settings
   */
  pages: {
    // Disable ads on these pages (affiliate pages)
    disabledPaths: [
      '/products',      // Has affiliate products
      '/deals',         // Has affiliate deals
      '/best-laptops',  // Has affiliate links
    ],

    // Limited ads (1-2 max) on these pages
    limitedAdsPaths: [
      '/laptop-comparison', // Some affiliate content
    ],

    // Full ad support on these pages
    fullAdsPaths: [
      '/',              // Homepage
      '/blog',          // Blog listing
      '/categories',    // Categories
      '/about',         // About page
      '/contact',       // Contact page
    ],
  },

  /**
   * Responsive breakpoints for ad sizes
   */
  breakpoints: {
    mobile: 768,    // Below this = mobile ads
    tablet: 1024,   // Between mobile and desktop
    desktop: 1280,  // Above this = full desktop ads
  },

  /**
   * Ad placement priorities (1 = highest)
   */
  priorities: {
    // Homepage
    'homepage-sidebar': 1,        // Sticky sidebar = best performance
    'homepage-hero-bottom': 2,    // Above fold = high visibility
    'homepage-mid-content': 3,    // Mid-page engagement

    // Blog
    'article-sidebar': 1,         // Sticky = best
    'article-top': 2,             // High visibility
    'article-in-content-1': 3,    // Mid-article engagement
    'blog-sidebar-top': 1,        // Sticky = best

    // Category
    'category-sidebar': 1,
  },

  /**
   * A/B Testing configurations
   */
  experiments: {
    enabled: false,
    
    // Test different ad placements
    variants: {
      'homepage-layout': {
        control: ['homepage-mid-content'],          // No sidebar
        variant: ['homepage-sidebar', 'homepage-mid-content'], // With sidebar
      },
      'article-density': {
        control: ['article-top', 'article-bottom'],           // 2 ads
        variant: ['article-top', 'article-in-content-1', 'article-bottom'], // 3 ads
      },
    },
  },

  /**
   * Analytics tracking
   */
  tracking: {
    // Track ad performance with Google Analytics
    enableGA4: true,
    
    // Custom events
    events: {
      adImpression: 'ad_impression',
      adClick: 'ad_click',
      adError: 'ad_error',
    },
  },
} as const;

/**
 * Helper: Check if ads are allowed on current page
 */
export function areAdsAllowedOnPage(pathname: string): boolean {
  if (!ADS_CONFIG.enabled) return false;

  // Check disabled paths
  if (ADS_CONFIG.pages.disabledPaths.some(path => pathname.startsWith(path))) {
    return false;
  }

  return true;
}

/**
 * Helper: Get max ads allowed for current page
 */
export function getMaxAdsForPage(pathname: string): number {
  if (!areAdsAllowedOnPage(pathname)) return 0;

  // Limited ads pages
  if (ADS_CONFIG.pages.limitedAdsPaths.some(path => pathname.startsWith(path))) {
    return 2;
  }

  return ADS_CONFIG.rules.maxAdsPerPage;
}

/**
 * Helper: Get ad slots for specific page
 */
export function getAdSlotsForPage(pageType: 'homepage' | 'blog' | 'article' | 'category'): string[] {
  const slots = ADS_CONFIG.slots;
  
  switch (pageType) {
    case 'homepage':
      return [
        slots['homepage-hero-bottom'],
        slots['homepage-sidebar'],
        slots['homepage-mid-content'],
      ];
    
    case 'blog':
      return [
        slots['blog-sidebar-top'],
        slots['blog-inline-1'],
        slots['blog-inline-2'],
      ];
    
    case 'article':
      return [
        slots['article-top'],
        slots['article-sidebar'],
        slots['article-in-content-1'],
        slots['article-bottom'],
      ];
    
    case 'category':
      return [
        slots['category-sidebar'],
        slots['category-inline'],
      ];
    
    default:
      return [];
  }
}

export default ADS_CONFIG;
