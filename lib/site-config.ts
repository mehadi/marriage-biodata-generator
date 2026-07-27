/**
 * Centralized site configuration for SEO and metadata.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourdomain.com).
 */

export const siteConfig = {
  name: "Marriage Bio Data Maker",
  shortName: "Bio Data Maker",
  description:
    "Create professional Islamic marriage bio data with beautiful templates. Free, private, and easy to use. Export to PDF or image.",
  /** Used for canonical URLs, sitemap, and Open Graph. No trailing slash. */
  url:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : "https://marriage-bio-data-maker.vercel.app",
  defaultLocale: "en" as const,
  /** SEO keywords; keep under ~10 for best practice. */
  keywords: [
    "marriage bio data",
    "Islamic bio data",
    "nikah bio data",
    "marriage biodata",
    "biodata maker",
    "marriage profile",
    "Islamic marriage",
    "bio data template",
    "free biodata creator",
  ],
  openGraph: {
    type: "website" as const,
    siteName: "Marriage Bio Data Maker",
    /** Add public/og-image.png (1200×630) for social previews; optional. */
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marriage Bio Data Maker - Create Islamic marriage biodata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: "@mehadi",
  },
  robots: {
    index: true,
    follow: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
