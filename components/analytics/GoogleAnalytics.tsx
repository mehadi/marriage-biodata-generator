import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-B7H8J54NND';

/**
 * Google Analytics 4 (gtag.js). The init snippet lives at public/ga4-init.js
 * (same-origin external script) instead of inline, so it needs no CSP
 * nonce/hash and doesn't force the app into dynamic rendering.
 * Note: GoogleTagManager.tsx is also present — if GA4 is (or will be) configured
 * *inside* that GTM container, having both wired can double-count pageviews.
 * Verify in GTM whether a GA4 Configuration tag already exists before relying on both.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script src="/ga4-init.js" strategy="afterInteractive" />
    </>
  );
}
