import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-inline' is required here: Next.js App Router streams RSC/hydration
      // data to the client via its own inline <script> tags, so a strict script-src
      // would break hydration on every page unless every route ran per-request with
      // a nonce (which forces dynamic rendering — tried, reverted after confirming
      // it broke static generation for / and /create, a worse trade for this app).
      // 'unsafe-eval' is required by a dependency in the /create bundle (isolated by
      // testing — likely zod's schema compilation or dnd-kit/react-day-picker).
      // GTM/GA4/Clarity bootstrap logic was still moved to same-origin external files
      // (public/gtm-init.js, public/ga4-init.js, app/clarity-init.js/route.ts) rather
      // than inline, which is a genuine reduction in inline-script surface even though
      // this CSP can't yet enforce "no inline scripts" while running Next.js this way.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://vitals.vercel-insights.com https://vercel.live https://www.clarity.ms",
      "frame-src 'self' https://www.googletagmanager.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
