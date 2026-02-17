'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Google AdSense Script Component
 * 
 * Loads AdSense script and initializes ads on the page.
 * Only loads in production when ADS_ENABLED is true.
 */
export default function AdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isProduction || !adsEnabled) {
      console.log('[AdSense] Ads disabled:', {
        isProduction,
        adsEnabled,
        publisherId: publisherId ? 'Set' : 'Not set',
      });
    }
  }, [isProduction, adsEnabled, publisherId]);

  // Don't load in development or if ads disabled
  if (!isProduction || !adsEnabled || !publisherId) {
    return null;
  }

  return (
    <>
      {/* Google AdSense Script */}
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('[AdSense] Failed to load:', e);
        }}
        onLoad={() => {
          console.log('[AdSense] Script loaded successfully');
        }}
      />

      {/* AdSense Auto Ads (Optional - remove if using manual placement only) */}
      {/* Uncomment below to enable Auto Ads */}
      {/*
      <Script
        id="google-adsense-auto"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${publisherId}",
              enable_page_level_ads: true
            });
          `,
        }}
      />
      */}
    </>
  );
}

/**
 * AdSense Verification Meta Tag Component
 * 
 * Add this to <head> for site verification
 * Get your verification code from AdSense dashboard
 */
export function AdSenseVerification({ code }: { code?: string }) {
  if (!code) return null;

  return (
    <meta name="google-adsense-account" content={code} />
  );
}
