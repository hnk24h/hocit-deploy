'use client';

import { useEffect, useRef } from 'react';

// Ad unit sizes supported by Google AdSense
export type AdSize = 
  | '728x90'      // Leaderboard (desktop)
  | '970x90'      // Large Leaderboard (desktop)
  | '300x250'     // Medium Rectangle (universal)
  | '336x280'     // Large Rectangle (universal)
  | '300x600'     // Half Page (sidebar)
  | '160x600'     // Wide Skyscraper (sidebar)
  | '320x50'      // Mobile Banner
  | '320x100'     // Large Mobile Banner
  | 'responsive'; // Responsive (auto-size)

interface AdUnitProps {
  /**
   * Unique identifier for this ad slot (from Google AdSense)
   */
  slot: string;
  
  /**
   * Ad size - can be fixed dimensions or responsive
   * @default 'responsive'
   */
  size?: AdSize;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Ad format (for responsive ads)
   * @default 'auto'
   */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  
  /**
   * Whether to show placeholder in development
   * @default true
   */
  showPlaceholder?: boolean;
}

/**
 * Google AdSense Ad Unit Component
 * 
 * Usage:
 * ```tsx
 * <AdUnit slot="1234567890" size="300x250" />
 * <AdUnit slot="0987654321" size="responsive" />
 * ```
 */
export default function AdUnit({
  slot,
  size = 'responsive',
  className = '',
  format = 'auto',
  showPlaceholder = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isProduction = process.env.NODE_ENV === 'production';
  // Explicitly check for 'true' string, default to false if not set
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  // Don't render ads if disabled (even in production)
  if (!adsEnabled) {
    if (!showPlaceholder) return null;
    
    // Show disabled placeholder
    return (
      <div
        className={`ad-placeholder border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{
          width: '100%',
          minHeight: 100,
        }}
      >
        <div className="text-center p-4">
          <div className="text-xs text-gray-500 dark:text-gray-600">
            Ads Disabled
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isProduction || !adsEnabled) return;

    try {
      // Push ad to AdSense queue
      // @ts-ignore - AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [isProduction, adsEnabled]);

  // Size configurations
  const sizeConfig = {
    '728x90': { width: 728, height: 90, display: 'inline-block' },
    '970x90': { width: 970, height: 90, display: 'inline-block' },
    '300x250': { width: 300, height: 250, display: 'inline-block' },
    '336x280': { width: 336, height: 280, display: 'inline-block' },
    '300x600': { width: 300, height: 600, display: 'inline-block' },
    '160x600': { width: 160, height: 600, display: 'inline-block' },
    '320x50': { width: 320, height: 50, display: 'inline-block' },
    '320x100': { width: 320, height: 100, display: 'inline-block' },
    'responsive': { width: '100%', height: 'auto', display: 'block' },
  };

  const style = sizeConfig[size];

  // Development placeholder
  if (!isProduction || !adsEnabled) {
    if (!showPlaceholder) return null;

    return (
      <div
        className={`ad-placeholder border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{
          width: size === 'responsive' ? '100%' : style.width,
          height: size === 'responsive' ? 250 : style.height,
          minHeight: size === 'responsive' ? 250 : undefined,
        }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 dark:text-gray-500 text-sm font-mono mb-2">
            [AD PLACEHOLDER]
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-600">
            Slot: {slot}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-600">
            Size: {size}
          </div>
          {!adsEnabled && (
            <div className="text-xs text-orange-500 mt-2">
              Ads disabled in development
            </div>
          )}
        </div>
      </div>
    );
  }

  // Production ad
  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: style.display,
          width: style.width,
          height: style.height,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={size === 'responsive' ? format : undefined}
        data-full-width-responsive={size === 'responsive' ? 'true' : undefined}
      />
    </div>
  );
}

/**
 * Ad Wrapper for common layouts
 */
export function AdSidebar({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <div className={`sticky top-24 ${className}`}>
      <AdUnit slot={slot} size="300x600" />
    </div>
  );
}

export function AdLeaderboard({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <AdUnit slot={slot} size="728x90" />
    </div>
  );
}

export function AdInContent({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <AdUnit slot={slot} size="336x280" />
    </div>
  );
}

export function AdMobileBanner({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <div className={`flex justify-center md:hidden ${className}`}>
      <AdUnit slot={slot} size="320x50" />
    </div>
  );
}
